---
title: "MCP Stdio: Masalah Besar yang Jarang Dibahas"
description: "Kenapa MCP server yang cuma support stdio transport itu nightmare untuk production multi-user. Breakdown lengkap pakai contoh Agno framework."
date: 2026-02-16T10:00:00+07:00
tags:
  - AI
  - programming
  - MCP
---

Kalau kamu pernah build AI agent yang pakai MCP (Model Context Protocol) dan deploy ke production untuk multi-user, pasti pernah ngerasain sakitnya. MCP server yang cuma support stdio transport itu... pain. Besar.

Saya mau breakdown kenapa ini jadi masalah serius, terutama buat yang lagi build AI agent pakai framework seperti Agno.

## Apa Itu MCP Transport?

Sebelum masuk ke masalahnya, sedikit konteks dulu. MCP punya beberapa jenis transport untuk komunikasi antara client dan server:

1. **stdio** — Komunikasi lewat standard input/output. Client spawn server sebagai child process.
2. **SSE (Server-Sent Events)** — Sudah deprecated.
3. **Streamable HTTP** — Standard baru yang direkomendasikan untuk production.

Nah, masalahnya banyak MCP server di luar sana yang **cuma support stdio**. Dan ini bikin hidup developer susah.

## Visualisasi: Stdio vs Streamable HTTP

Biar gampang kebayang, lihat dua diagram ini.

**Stdio Transport** — setiap user spawn process sendiri:

<img src="/images/uploads/mcp-stdio-architecture.svg" alt="MCP dengan Stdio Transport - setiap user spawn process baru" style="width:100%;max-width:920px;" loading="lazy" />

**Streamable HTTP Transport** — semua user share satu server:

<img src="/images/uploads/mcp-streamable-http-architecture.svg" alt="MCP dengan Streamable HTTP Transport - semua user share satu server" style="width:100%;max-width:920px;" loading="lazy" />

Beda banget kan? Yang satu bikin server kamu meledak, yang satu lagi production-ready. Mari kita breakdown lebih detail.

## Kenapa Stdio Itu Bermasalah?

### 1. Satu Process Per User

Ini masalah paling fundamental. Dengan stdio, client harus **spawn server sebagai child process**. Artinya setiap koneksi = satu process baru. Kalau kamu punya 100 user concurrent, kamu butuh 100 process berjalan bersamaan.

Bayangin kamu build AI agent yang serve 1000 user. Setiap request, server harus:

- Spawn process baru
- Initialize semua tools
- Jalankan query
- Matikan process

Itu **boros banget** dari sisi resource. CPU, memory, semuanya naik linear dengan jumlah user. Nggk scalable sama sekali.

### 2. Reinitialize Setiap Request

Ini yang bikin kesel. Karena stdio itu stateful per-process, setiap kali user baru masuk, semua tool harus di-reinitialize dari awal. Nggk ada session sharing. Nggk ada connection pooling. Setiap request itu fresh start.

Kalau MCP server-nya berat (misal connect ke database, load model, atau setup credential), initialization time ini bisa signifikan. User nunggu, resource terbuang, dan developer frustasi.

### 3. Token Cost yang Membengkak

Ini yang jarang dibahas. Setiap kali agent connect ke MCP server, semua tool definitions harus di-inject ke context window LLM. Itu artinya setiap request, token cost kamu naik karena harus kirim ulang semua tool schema.

Kalau punya 20-30 tools dari berbagai MCP server? Bisa ratusan sampai ribuan token **per request** cuma untuk tool definitions aja. Multiply dengan jumlah user dan jumlah request per hari. Billing LLM kamu bakal nangis.

### 4. Maintenance Nightmare

Stdio transport bikin deployment jadi ribet. Server harus di-install di setiap mesin yang jalan. Nggk bisa centralize. Nggk bisa load balance. Kalau ada update, harus update di semua instance. Monitoring juga susah karena setiap process itu isolated.

## Contoh Nyata dengan Agno Framework

Biar lebih jelas, saya pakai Agno sebagai contoh karena framework ini cukup populer dan punya MCP integration yang solid.

### Stdio Approach (Masalah)

Ini cara pakai MCP dengan stdio di Agno:

```python
import asyncio
from agno.agent import Agent
from agno.tools.mcp import MCPTools

async def handle_user_request(user_message: str):
    # Setiap request = spawn process baru
    mcp_tools = MCPTools(command="npx -y @openbnb/mcp-server-airbnb --ignore-robots-txt")
    await mcp_tools.connect()  # spawn child process, initialize tools

    try:
        agent = Agent(tools=[mcp_tools], markdown=True)
        await agent.aprint_response(user_message, stream=True)
    finally:
        await mcp_tools.close()  # kill process

asyncio.run(handle_user_request("Cari hotel di Bali untuk 2 orang"))
```

Lihat masalahnya? Setiap kali `handle_user_request` dipanggil, Agno harus:

1. `MCPTools(command=...)` — Siapkan command untuk spawn process
2. `await mcp_tools.connect()` — Spawn child process lewat stdio, initialize semua tools
3. Jalankan agent
4. `await mcp_tools.close()` — Kill process

Kalau 100 user hit endpoint ini bersamaan, ada 100 child process yang di-spawn. Masing-masing nge-run `npx`, load Node.js runtime, initialize MCP server. Itu **gila** dari sisi resource.

Dan kalau pakai `MultiMCPTools` dengan multiple server? Lebih parah lagi:

```python
async def handle_user_request(user_message: str):
    # Setiap request spawn MULTIPLE processes
    mcp_tools = MultiMCPTools(
        commands=[
            "npx -y @openbnb/mcp-server-airbnb --ignore-robots-txt",
            "npx -y @modelcontextprotocol/server-google-maps",
        ],
        env=env,
    )
    await mcp_tools.connect()  # spawn 2 child processes!

    try:
        agent = Agent(tools=[mcp_tools], markdown=True)
        await agent.aprint_response(user_message, stream=True)
    finally:
        await mcp_tools.close()  # kill 2 processes
```

100 user = 200 child process. Masing-masing butuh Node.js runtime. RIP server kamu.

### Streamable HTTP Approach (Solusi)

Sekarang bandingin dengan Streamable HTTP:

```python
import asyncio
from agno.agent import Agent
from agno.tools.mcp import MCPTools

# MCP server jalan sebagai service terpisah yang handle multiple connections
SERVER_URL = "http://mcp-airbnb.internal:8000/mcp"

async def handle_user_request(user_message: str):
    # Connect ke running server, BUKAN spawn process baru
    mcp_tools = MCPTools(
        transport="streamable-http",
        url=SERVER_URL,
    )
    await mcp_tools.connect()  # HTTP connection, no process spawn

    try:
        agent = Agent(tools=[mcp_tools], markdown=True)
        await agent.aprint_response(user_message, stream=True)
    finally:
        await mcp_tools.close()
```

Bedanya besar:

- **Satu server instance** handle semua user. Nggk ada spawn process per request.
- **HTTP connection** yang ringan, bukan child process yang berat.
- Server bisa di-**scale horizontally** — tambah instance kalau traffic naik.
- Bisa pakai **load balancer**, **session management**, dan **OAuth 2.1**.
- Server bisa **stateless** — nggk perlu maintain state per-connection.

Dan kalau kamu yang bikin MCP server sendiri, pakai FastMCP itu gampang banget:

```python
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("my_service")

@mcp.tool()
def search_hotels(location: str, guests: int) -> str:
    # Logic pencarian hotel
    return f"Found 10 hotels in {location} for {guests} guests"

@mcp.tool()
def get_recommendations(location: str) -> str:
    return f"Top recommendations for {location}: ..."

if __name__ == "__main__":
    # Jalan sebagai HTTP server, bukan stdio
    mcp.run(transport="streamable-http")
```

Satu server, handle semua request. Simple. Scalable. Production-ready.

## Perbandingan Resource

Biar lebih visual, ini perkiraan resource usage untuk 100 concurrent users:

| | Stdio | Streamable HTTP |
|---|---|---|
| **Processes** | 100 (satu per user) | 1 (shared server) |
| **Memory** | ~100MB per process = ~10GB | ~500MB total |
| **Startup time** | ~2-5 detik per request | ~50ms per request |
| **Tool init** | Setiap request | Sekali saat server start |
| **Scalability** | Vertical only | Horizontal + Vertical |
| **Load balancing** | Nggk bisa | Bisa |

Angka-angka di atas perkiraan kasar, tapi gambarannya jelas.

## Token Cost Breakdown

Ini yang bikin dompet nangis. Misalkan satu MCP server punya 15 tools, dan setiap tool definition rata-rata 200 token:

- **Per request**: 15 tools × 200 tokens = 3,000 tokens cuma untuk tool definitions
- **1,000 request/hari**: 3,000,000 tokens
- **Sebulan**: ~90,000,000 tokens

Dengan stdio, karena setiap request itu fresh start, tool definitions SELALU dikirim ulang. Dengan Streamable HTTP dan session management yang proper, ada potensi untuk caching dan optimisasi yang bisa ngurangin overhead ini.

Dan ini cuma satu MCP server. Kalau pakai 3-4 server sekaligus? Multiply aja.

## Apa yang Harus Dilakukan?

### Kalau Kamu User MCP Server

1. **Pilih MCP server yang support Streamable HTTP.** Kalau nggk ada, cari alternatif atau buat wrapper sendiri.
2. **Hindari stdio di production.** Stdio itu bagus untuk development dan testing. Untuk production multi-user? Jangan.
3. **Hitung token cost.** Sebelum deploy, hitung berapa token yang bakal terbuang untuk tool definitions per request.

### Kalau Kamu Developer MCP Server

1. **Support Streamable HTTP dari awal.** Jangan cuma stdio. User kamu bakal deploy ini di production.
2. **Pakai FastMCP.** Gampang banget switch dari stdio ke Streamable HTTP. Literally cuma ganti parameter `transport`.
3. **Dokumentasikan kedua transport.** Kasih contoh untuk local development (stdio) DAN production (Streamable HTTP).

### Kalau Pakai Agno

Agno sekarang sudah support ketiga transport (stdio, SSE, Streamable HTTP). Untuk production:

```python
# Development (local, single user)
mcp_tools = MCPTools(command="uvx mcp-server-git")

# Production (multi-user, scalable)
mcp_tools = MCPTools(
    transport="streamable-http",
    url="https://your-mcp-server.com/mcp",
)
```

Sesimple itu perbedaannya dari sisi client code. Tapi impact ke resource, cost, dan maintainability itu besar banget.

## Penutup

MCP itu protokol yang powerful. Tapi banyak implementasi di luar sana yang cuma support stdio, dan ini jadi bottleneck serius untuk production deployment. Kalau kamu lagi build AI agent untuk multi-user, pastikan MCP server yang kamu pakai support Streamable HTTP.

Stdio itu bukan transport yang salah — dia memang didesain untuk local, single-user use case. Masalahnya adalah ketika orang pakai dia untuk sesuatu yang bukan use case-nya, dan MCP server nggk kasih pilihan lain.

Semoga bermanfaat. Happy coding!
