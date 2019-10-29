---
title: Improving web performances using Progressive Image Lazyloading (Part 1/2)
description: >-
  We know about Lazyload but how about Progressive Image Loading, and what is
  Progressive Image Lazyloading? How it can significantly improve our web
  performances?
date: 2019-10-28T19:52:01.865Z
tags:
  - Javascript
  - Modern Web
  - Performances
---
Jadi, untuk mempermudah penjelasan saya, artikel ini akan saya bawakan dalam bahasa Indonesia. Jika ada yang berminat untuk membantu saya menerjemahkan dengan baik artikel ini, silahkan lakukan _Pull Request_ (PR) ke blog (link _github_ ada pada _footer blog_). Topik ini akan saya bagi menjadi 2 artikel karena lumayan panjang. Ini adalah artikel pertama.

# Overview

Seperti yang sudah saya jelaskan pada bagian akhir artikel saya sebelumnya, kali ini saya akan mengulas beberapa cara dalam menampilkan gambar pada web dalam hubungan dengan meningkatkan _performances_ web itu sendiri.

Setiap front-end/fullstack developer memiliki cara yang berbeda-beda dalam meningkatkan _performances_ pada website. Salah satu cara paling umum adalah bagaimana melakukan _request management_ pada proses _rendering images_ pada web. Salah satu teknik yang terkenal ialah _Lazyloading_. Cara yang lain dan cukup populer ialah [_Progressive Image Loading_](https://jmperezperez.com/medium-image-progressive-loading-placeholder), cara ini hampir (r: mirip) dengan yang [Medium](https://medium.com) lakukan. Alasan utama dari tindakan ini tak lain adalah untuk meningkatkan performa web secara signifikan. Untuk penjelasan lebih detail di artikel ini, saya akan bagi pembahasannya menjadi 3 bagian beserta contoh, implementasinya, dan seberapa besar pengaruhnya pada performa website.

## 1. Old ways, STF*, let's rendering all images

Cara pertama dan yang paling banyak masih dilakukan oleh developer (apalagi pemula kayak saya :v), adalah _"Bruh, jangan lupa artikelnya harus ada gambar. Nggak usah di compress supaya bagus, tampilkan semuanya sekaligus!"_. 

Cara ini adalah cara paling BERBAHAYA menurut saya. Bayangkan jika satu halaman tertentu memiliki banyak gambar. Jika tidak ada _Image management_ dari sisi _code_, akan seperti apa lamanya?. Mari kita buktikan. Saya sudah menyediakan contoh web yang menampilkan 6 gambar dengan 5 gambar diantaranya beresolusi besar dan lebih dari 1MB Total (10.1 MB). Silahkan buka [blog-without-lazyload.herokuapp.com](https://blog-without-lazyload.herokuapp.com/), matikan cache browser, atau tekan _cmd+shift+R_. 

Sederhanya website ini hanya menampikan 6 gambar, dan informasi seberapa lama waktu yang dibutuhkan untuk proses _load_ seluruh gambar yang ada pada halaman.

```html
<body>
    <h1>DISCLAIMER: All Images from <a href="https://unsplash.com">https://unsplash.com</a> (THANK YOU). FOR Educational
 Purpose Only!</h1>
    <h2>Rendering time: <span style="background-color: red; color: white; padding: 2px 5px;" id="rendering-time"> ... counting (wait until all image fully loaded)</span> </h2>
    <img src="img/photo@1.jpg">
    <img src="img/photo@2.jpg">
    <img src="img/photo@3.jpg">
    <img src="img/photo@4.jpg">
    <img src="img/photo@5.jpg">
    <img src="img/photo@6.jpg">
</body>
```

Untuk menampilkan informasi waktu, saya membuat script JS sederhana untuk melakukan  _time tracking_ pada _event windows.onload_.

```javascript
var timerStart = Date.now();
window.onload = (event) => {
    //eksekusi waktu ketika page telah load seutuhnya
    let loadTime = (Date.now() - timerStart) / 1000;
    document.getElementById("rendering-time").innerHTML = loadTime + 's';
};
```

Hasilnya seperti berikut (Waktu _load_ tergantung _device_ dan koneksi):

![Site-without-lazyload](/images/uploads/site-without-lazyload.png "Site-without-lazyload")

Proses ini membutuhkan waktu setidaknya **41 detik** untuk menampilkan ke-6 gambar secara utuh. Terlihat pada _network tab DevTools_ bagaimana proses _rendering_ terjadi.

Dengan waktu seperti itu, akan terasa betapa lambat webnya melebihi web pada umumnya. Bagaimana kita mengurangi waktu _onload_ ini? kita gunakan cara paling lazim di modern _web apps_, **lazy loading**.

## 2. Lazyload, Rendering image based on current visible viewport.

_Lazyload_ adalah teknik lazim saat sebuah halaman memiliki banyak _images_. Silahkan baca-baca artikel yang banyak bertebaran tentang teknik ini. Singkatnya dengan _Lazyload_, browser hanya akan _rendering_ gambar yang terlihat pada layar kaca device anda. Misalnya, contoh diatas ada 6 gambar, dan yang terlihat saat pertama kali _loading web_ adalah 3 gambar. Maka hanya 3 gambar ini yang akan di _request_ oleh _browser_ ke _server_. 3 gambar akan di _request_ ketika kita _scroll_ nantinya. 

Untuk teknik ini, saya menambahkan script javascript lazyload yang populer di [_github_](https://github.com/tuupola/lazyload). Sesuai dokumentasinya, _code  HTML_ saya berubah menjadi:

```html
<img class="lazyload" data-src="img/photo@1.jpg" src="img/thumbs/photo@1.jpg">
<img class="lazyload" data-src="img/photo@2.jpg" src="img/thumbs/photo@2.jpg">
<img class="lazyload" data-src="img/photo@3.jpg" src="img/thumbs/photo@3.jpg">
<img class="lazyload" data-src="img/photo@4.jpg" src="img/thumbs/photo@4.jpg">
<img class="lazyload" data-src="img/photo@5.jpg" src="img/thumbs/photo@5.jpg">
<img class="lazyload" data-src="img/photo@6.jpg" src="img/thumbs/photo@6.jpg">
```

Kemudian, saya menambahkan script untuk mengaktifkan fitur _lazyload_:

```javascript
<script src="https://cdn.jsdelivr.net/npm/lazyload@2.0.0-rc.2/lazyload.js"></script>
<script>
    //aktifkan lazyload. semua tag img dengan attr data-src dan class lazyload akan mendapatkan efek lazyload.
    lazyload();
</script>
```

Setelah menerapkan teknik ini, waktu _rendering_ halaman _web_ menurun **\- 25%** menjadi **29.6 detik!** Silahkan buka [blog-without-lazyload.herokuapp.com/lazyload.html](https://blog-without-lazyload.herokuapp.com/lazyload.html), matikan cache browser, atau tekan _cmd+shift+R_

![site-with-lazyload](/images/uploads/site-with-lazyload.png "site-with-lazyload")

Terlihat pada gambar, _browser_ hanya melakukan _request_ ke _server_ 3 gambar yang muncul dilayar. Jika halaman di _scroll_, _browser_ kembali melakukan request 3 gambar sisanya. 

Pertanyaannya adalah, apakah teknik ini sudah yang paling baik? apakah ada teknik yang lain untuk mengurangi waktu _page render_? Jawabannya ada, teknik itu disebut dengan **Progressive Image Loading**.

## Progressive Image Loading, Medium-like Rendering Image Method

Progressive Image Loading pertama kali diperkenalkan oleh [José M. Pérez](https://jmperezperez.com/medium-image-progressive-loading-placeholder). Teknik ini mirip dengan yang diperkenalkan _facebook_ dengan fitur [_review image_](https://engineering.fb.com/android/the-technology-behind-preview-photos/)  pada aplikasinya. Singkatnya, teknik ini akan mengganti proses _render image_ pada halaman kita menjadi 3 step utama:



* **Render div with image & placeholder**. Terdapat sebuah _placeholder_ (_div_) yang didalamnya terdiri dari gambar utama dan gambar pengganti (_placeholder_). Gambar pengganti ialah gambar yang sama dengan gambar utama hanya saja memiliki kualitas kompresi dan juga ukuran yang lebih kecil. Biasanya berukuran sekitar 42px. Pada kasus ini saya menggunakan 2px saja, selain lebih kecil dan hasilnya sama saja, juga sangat mengurangi penggunaan _bandwidth user_.

* **Render placeholder image instead of original-image**. Saat halaman dibuka, _browser_ melakukan _request_ ke _server_ untuk kedua jenis gambar. Sejalan dengan _request original image_ yang lama dan besar, _browser_ akan menampilkan gambar pengganti.

* **Once Original Image is loaded, it will shown to the user and placeholder is hidden**. 



Antara proses 2 & 3, gambar _placeholder_ akan ditampilkan dalam bentuk _blur_ hingga gambar asli selesai di _load_ oleh _browser_. Proses mengunduh gambar asli inilah yang disebut dengan _progressive_. Lebih jelasnya silahkan lihat contoh hasil penerapan metode ini di [blog-without-lazyload.herokuapp.com/progressive.html](https://blog-without-lazyload.herokuapp.com/progressive.html), matikan cache browser, atau tekan _cmd+shift+R_.


![Site-with-progressive](/images/uploads/site-with-progressive-load.png "Site-with-progressive")

Jangan kaget dengan hasilnya. Itulah kenapa saya sangat menyarankan metode ini ketimbang _lazyload_, hehehe.

### What's going on here? How it can be so fast!?

Singkatnya, setiap gambar yang diupload oleh sistem akan memiliki sebuah gambar _placeholder_ berukuran 2px dan 20% _quality_ dari gambar asli. Gambar ini dipakai sebagai gambar `sementara` selagi gambar asli sedang diunduh _browser_. Oleh sebab hal ini, proses _rendering time_ berkurang drastis dari **41 detik** ke hanya **1.9 detik!! YES, -95% DARI PROSES PADA TAHAP PERTAMA!**

Kalian mungkin masih bingung, apa yang sebenarnya terjadi. Hal ini akan saya jelaskan di artikel selanjutnya, sekaligus mengenalkan teknik yang lain yang lebih lebih bagus lagi dari teknik ini (serius :v). 

Source code dari semua contoh diatas, dapat diakses pada [repo github](https://github.com/arhen/image-rendering-tips). _Code_ oleh [Jose](https://jmperezperez.com/medium-image-progressive-loading-placeholder) telah saya modifikasi untuk memenuhi kebutuhan bukan hanya untuk 1 gambar saja, tapi semua gambar yang ditentukan pada halaman.


Happy Coding Gez! (/¯◡ ‿ ◡)/¯﻿
