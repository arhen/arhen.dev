---
title: "The Three Deadly Sins in Engineering Leadership"
date: 2025-11-03T10:00:00+07:00
description: "A deep dive into the three pillars of scaling to solve The Three Deadly Sins in Engineering Leadership."
tags:
  - engineering
  - leadership
  - career
---

{{< img src="images/uploads/three-deadly-sins-banner.png" alt="The Three Deadly Sins in Engineering Leadership" >}}

I've worn a lot of hats in my career. Co-Founder, CTO, Software Engineer, and now Lead Engineer. Each transition taught me something new, but more importantly, each one forced me to unlearn something I thought I knew.

And here's what I've realized:

> A lot of Tech Leads and Software Architects, including my past self, make decisions based on ego rather than actual business needs.

It's uncomfortable to admit, but it's true.

## The Lead's Dilemma

There's this unspoken pressure when you're in a leadership role. You feel like you need to prove you're "up-to-date." You want to show that you know the latest frameworks, the hottest architectures, the coolest tools. Your LinkedIn feed is full of people talking about microservices, Kubernetes, and whatever new thing just dropped on Hacker News.

So what do you do? You overcompensate. You choose complexity over simplicity. You pick "cool" over "practical." And before you know it, you've built a spaceship when all you needed was a bicycle.

I've been there. I've made those mistakes. And I've seen countless others make them too.

## The Three Deadly Sins

After years of observing (and sometimes committing) these mistakes, I've identified three deadly sins that plague engineering leadership:

### 1. Over Engineering

This one's a classic. You're building a new app, and suddenly you're designing for 10,000 concurrent users and 1,000 requests per second. Day one. Zero users. Zero revenue. But hey, at least your architecture can "scale," right?

*For what???*

I've seen Lead Engineers spend weeks setting up elaborate microservice architectures for apps that never got past 100 users. All that complexity? It just slowed down development and burned through runway. The business died before the "scalable" architecture ever needed to scale.

Here's the thing: complexity is a cost. Every abstraction layer, every additional service, every "just in case" feature adds cognitive load, maintenance burden, and potential points of failure. Sometimes a monolith is exactly what you need. Sometimes a simple PostgreSQL database is better than a fancy distributed system.

### 2. Out of Capability

This one hits different because it's often dressed up as "pushing the team to grow."

You pick a tech stack because it's exciting to *you*. Rust! Elixir! That new framework with 200 GitHub stars! But your team? They've never touched it. Now you're forcing them to learn something completely new under deadline pressure.

The result? Either you burn out your existing team, or you're forced to hire new people who know the stack. Neither is great for the business. You've essentially created a problem that didn't need to exist, all because you wanted to play with shiny new toys.

Don't get me wrong, learning new things is important. But there's a difference between strategic skill development and ego-driven technology choices. One serves the team and business. The other serves... well, just you.

### 3. FDD (FOMO Driven Development)

This is the worst one. And honestly? It's everywhere.

Every time a new technology trends on X/Twitter, there's a wave of engineering leaders who suddenly want to "modernize" their perfectly working systems. New AI wrapper dropped? Let's integrate it! New database everyone's talking about? Time to migrate! New framework with a slick landing page? Rewrite everything!

And the most painful version of this: choosing expensive paid services when simpler, self-hosted alternatives would work just fine. "Let's use this $500/month service instead of spending a day setting up the open-source equivalent." Sometimes that makes sense. Often it doesn't.

FOMO is a hell of a drug. And in engineering leadership, it can bankrupt your company.

## The Scaling Mindset Pillars

So what should you focus on instead? I call it the "Scaling Mindset," and it goes way beyond just technical scaling.

### Tech Scaling

Yes, your technology should be able to grow with your users. But "scaling" doesn't mean "build everything for million-user scale from day one." It means choosing technologies that can *adapt* linearly as needs grow, without creating roadblocks for development.

Start simple. Add complexity only when you have data proving you need it. That's it. That's the secret.

### Team Scaling

This one's harder than tech scaling, and it's way more important.

You need to think about *when* and *how* to grow your team from day one. But here's the thing: adding people doesn't automatically make things faster. In fact, done wrong, it makes everything slower. Brooks' Law is real. "Adding manpower to a late software project makes it later."

When do you hire? Who do you hire? How do you onboard them without killing productivity? These questions matter more than which database you choose. Trust me.

### Cost Scaling

This is the skill that separates experienced leaders from everyone else. And honestly, it's the hardest one to develop without real-world experience.

You need to understand cost-effectiveness at every milestone of your product. "At 100 users, this setup is enough." "At 10,000 users, we'll need to upgrade this specific component." "At 100,000 users, here's where the real architectural changes happen."

When you have this mindset, you're not over-investing early, and you're not caught off-guard later. You know exactly when to build versus when to buy. And that's incredibly valuable.

## Practical Wisdom: Idealism vs Reality

Let me give you some concrete examples of how this plays out:

**Architecture choices:**
- *Idealism:* "We need microservices because that's what Netflix uses!"
- *Reality:* Laravel monolith or Go monolith handles most use cases beautifully. Save microservices for when you actually have the team size and complexity that demands it.

**Infrastructure:**
- *Idealism:* "AWS/GCP for everything because that's enterprise-grade!"
- *Reality:* Vercel or Railway if you need speed. Hetzner if you need cost efficiency. Local providers if you need regulatory compliance. Use the right tool for your actual situation.

**Tooling:**
- *Idealism:* "Let's self-host everything for maximum control!"
- *Reality:* Posthog's free tier is probably enough for your analytics. Datadog or managed services save your DevOps team from drowning in ELK stack maintenance. Your time has a cost too.

**Communication tools:**
- *Idealism:* "We'll build our own email infrastructure with Amazon SES!"
- *Reality:* Just use Brevo or Mailgun. Your engineers have better things to do.

## The Bottom Line

Here's what I've learned: not every engineering leader is directly responsible for generating revenue. But *every* engineering leader is responsible for costs, people costs, process costs, infrastructure costs.

Your job isn't to build the most impressive system. Your job is to build the *right* system, one that delivers value while keeping costs in check.

Drop the ego. Embrace pragmatism. And maybe, just maybe, we can all stop building spaceships when bicycles would do just fine.

---

*This post is an expanded version of my [LinkedIn post](https://www.linkedin.com/posts/rahmadslamet_pengalaman-jadi-co-founder-cto-software-activity-7393557739580547072-B04_), which was inspired by [Listiarso Wastuargo's original post](https://www.linkedin.com/posts/lwastuargo_beberapa-tahun-terakhir-udah-coaching-lebih-activity-7391070404443893760-F8r7). I highly recommend reading his post. He's coached over 40 startups and shares honest insights about the Build vs. Buy decisions that most CTOs get wrong.*
