var kotaSaatIni = "Lampung";
var satuanCelcius = true;
var daftarFavorit = [];
var dataCuaca = null;

var daftarProvinsi = [
  "Nanggroe Aceh Darussalam",
  "Sumatera Utara",
  "Sumatera Selatan",
  "Sumatera Barat",
  "Bengkulu",
  "Riau",
  "Kepulauan Riau",
  "Jambi",
  "Lampung",
  "Bangka Belitung",
  "Kalimantan Barat",
  "Kalimantan Timur",
  "Kalimantan Selatan",
  "Kalimantan Tengah",
  "Kalimantan Utara",
  "Banten",
  "DKI Jakarta",
  "Jawa Barat",
  "Jawa Tengah",
  "DI Yogyakarta",
  "Jawa Timur",
  "Bali",
  "Nusa Tenggara Timur",
  "Nusa Tenggara Barat",
  "Gorontalo",
  "Sulawesi Barat",
  "Sulawesi Tengah",
  "Sulawesi Utara",
  "Sulawesi Tenggara",
  "Sulawesi Selatan",
  "Maluku Utara",
  "Maluku",
  "Papua Barat",
  "Papua",
  "Papua Tengah",
  "Papua Pegunungan",
  "Papua Selatan",
  "Papua Barat Daya",
];

var simpananFavorit = localStorage.getItem("favoritCuaca");
if (simpananFavorit) {
  daftarFavorit = JSON.parse(simpananFavorit);
}

var lokasiTerakhir = localStorage.getItem("lokasiTerakhir");
if (lokasiTerakhir) {
  kotaSaatIni = lokasiTerakhir;
}

window.onload = function () {
  cekTema();
  tampilkanFavorit();
  ambilDataCuaca();

  setInterval(ambilDataCuaca, 300000);

  setInterval(updateJam, 1000);
  updateJam();
};

function updateJam() {
  var sekarang = new Date();
  var opsiTanggal = {
    weekday: "long",
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  var tanggalStr = sekarang.toLocaleDateString("id-ID", opsiTanggal);
  var waktuStr = sekarang.toLocaleTimeString("id-ID");

  document.getElementById("display-date").textContent =
    tanggalStr + " | " + waktuStr;
}

async function ambilDataCuaca() {
  document.getElementById("loading").classList.remove("hidden");

  var url = "data/cuaca.json";

  try {
    var response = await fetch(url);

    if (!response.ok) {
      throw new Error("Gagal membaca file JSON");
    }

    var semuaVariasi = await response.json();
    var indexAcak = Math.floor(Math.random() * semuaVariasi.length);

    dataCuaca = semuaVariasi[indexAcak];

    setTimeout(function () {
      updateTampilan();
      document.getElementById("loading").classList.add("hidden");
    }, 500);
  } catch (error) {
    console.log("Error:", error);
    alert("Gagal memuat data.");
    document.getElementById("loading").classList.add("hidden");
  }
}

function updateTampilan() {
  if (!dataCuaca) return;

  var saatIni = dataCuaca.current;
  var harian = dataCuaca.daily;

  document.getElementById("display-city").textContent = kotaSaatIni;

  var waktuUpdate = new Date();
  document.getElementById("last-update").textContent =
    waktuUpdate.toLocaleTimeString();

  document.getElementById("current-temp").textContent = hitungSuhu(
    saatIni.temperature_2m
  );
  document.getElementById("current-humidity").textContent =
    saatIni.relative_humidity_2m;
  document.getElementById("current-wind").textContent = saatIni.wind_speed_10m;

  var infoCuaca = dapatkanInfoCuaca(saatIni.weather_code);
  document.getElementById("weather-desc").textContent = infoCuaca.label;
  document.getElementById("weather-icon").innerHTML = infoCuaca.icon;

  var htmlRamalan = "";

  for (var i = 0; i < 5; i++) {
    var suhuMax = hitungSuhu(harian.temperature_2m_max[i]);
    var suhuMin = hitungSuhu(harian.temperature_2m_min[i]);
    var kode = harian.weather_code[i];
    var info = dapatkanInfoCuaca(kode);

    var tgl = new Date();
    tgl.setDate(tgl.getDate() + i + 1);
    var namaHari = tgl.toLocaleDateString("id-ID", { weekday: "long" });

    htmlRamalan +=
      '<div class="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm text-center transform hover:scale-105 transition">';
    htmlRamalan +=
      '<p class="font-bold text-gray-600 dark:text-gray-300 mb-2">' +
      namaHari +
      "</p>";
    htmlRamalan +=
      '<div class="text-3xl text-blue-500 mb-2">' + info.icon + "</div>";
    htmlRamalan +=
      '<div class="flex gap-2 justify-center text-sm font-medium">';
    htmlRamalan +=
      '<span class="text-gray-900 dark:text-white">' + suhuMax + "°</span>";
    htmlRamalan += '<span class="text-gray-400">' + suhuMin + "°</span>";
    htmlRamalan += "</div></div>";
  }

  document.getElementById("forecast-grid").innerHTML = htmlRamalan;
  updateTombolFavorit();
}

var timerKetik;

function ketikaKetikKota(event) {
  if (event.key === "Enter") {
    cariKota();
    return;
  }

  var teks = document.getElementById("city-input").value.toLowerCase();
  var kotakSaran = document.getElementById("suggestions");

  if (teks.length < 2) {
    kotakSaran.classList.add("hidden");
    return;
  }

  var hasilPencarian = daftarProvinsi.filter(function (prov) {
    return prov.toLowerCase().includes(teks);
  });

  if (hasilPencarian.length > 0) {
    var html = "";
    hasilPencarian.forEach(function (namaProvinsi) {
      html += "<div onclick=\"pilihKota('" + namaProvinsi + "')\" ";
      html +=
        'class="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer border-b dark:border-gray-600">';
      html += '<p class="font-medium">' + namaProvinsi + "</p>";
      html += '<p class="text-xs text-gray-500">Indonesia</p>';
      html += "</div>";
    });

    kotakSaran.innerHTML = html;
    kotakSaran.classList.remove("hidden");
  } else {
    kotakSaran.classList.add("hidden");
  }
}

function pilihKota(nama) {
  kotaSaatIni = nama;
  document.getElementById("suggestions").classList.add("hidden");
  document.getElementById("city-input").value = nama;

  localStorage.setItem("lokasiTerakhir", nama);

  ambilDataCuaca();
}

function cariKota() {
  var teks = document.getElementById("city-input").value;
  if (teks) {
    pilihKota(teks);
  }
}

function ambilLokasiSaya() {
  var randomProv =
    daftarProvinsi[Math.floor(Math.random() * daftarProvinsi.length)];
  pilihKota(randomProv);
}

function tambahKeFavorit() {
  var sudahAda = false;
  for (var i = 0; i < daftarFavorit.length; i++) {
    if (daftarFavorit[i] === kotaSaatIni) {
      sudahAda = true;
      daftarFavorit.splice(i, 1);
      break;
    }
  }

  if (!sudahAda) {
    daftarFavorit.push(kotaSaatIni);
  }

  localStorage.setItem("favoritCuaca", JSON.stringify(daftarFavorit));
  tampilkanFavorit();
  updateTombolFavorit();
}

function tampilkanFavorit() {
  var wadah = document.getElementById("favorites-list");
  wadah.innerHTML = "";

  if (daftarFavorit.length === 0) {
    wadah.innerHTML =
      '<p class="text-sm text-gray-500 text-center py-4">Belum ada favorit</p>';
    return;
  }

  daftarFavorit.forEach(function (namaProv) {
    var div = document.createElement("div");
    div.className =
      "flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg cursor-pointer hover:bg-blue-50 mb-2";
    div.onclick = function () {
      pilihKota(namaProv);
    };
    div.innerHTML =
      '<span class="font-medium text-sm">' +
      namaProv +
      '</span> <i class="fa-solid fa-chevron-right text-xs"></i>';
    wadah.appendChild(div);
  });
}

function updateTombolFavorit() {
  var btn = document.getElementById("fav-icon-btn");
  var ada = false;
  if (daftarFavorit.includes(kotaSaatIni)) {
    ada = true;
  }

  if (ada) {
    btn.classList.remove("fa-regular");
    btn.classList.add("fa-solid", "text-yellow-400");
  } else {
    btn.classList.add("fa-regular");
    btn.classList.remove("fa-solid", "text-yellow-400");
  }
}

function gantiSatuan() {
  satuanCelcius = !satuanCelcius;
  var label = satuanCelcius ? "°C" : "°F";
  document.getElementById("unit-display").textContent = label;
  document.getElementById("unit-label").textContent = label;
  updateTampilan();
}

function hitungSuhu(nilai) {
  if (satuanCelcius) return Math.round(nilai);
  return Math.round((nilai * 9) / 5 + 32);
}

function cekTema() {
  if (
    localStorage.tema === "dark" ||
    (!("tema" in localStorage) &&
      window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark");
    document
      .getElementById("theme-icon")
      .classList.replace("fa-moon", "fa-sun");
  } else {
    document.documentElement.classList.remove("dark");
  }
}

function gantiTema() {
  var html = document.documentElement;
  var icon = document.getElementById("theme-icon");
  if (html.classList.contains("dark")) {
    html.classList.remove("dark");
    localStorage.tema = "light";
    icon.classList.replace("fa-sun", "fa-moon");
  } else {
    html.classList.add("dark");
    localStorage.tema = "dark";
    icon.classList.replace("fa-moon", "fa-sun");
  }
}

function dapatkanInfoCuaca(kode) {
  if (kode === 0)
    return {
      label: "Cerah",
      icon: '<i class="fa-solid fa-sun text-yellow-500"></i>',
    };
  if (kode >= 1 && kode <= 3)
    return {
      label: "Berawan",
      icon: '<i class="fa-solid fa-cloud-sun text-orange-400"></i>',
    };
  if (kode >= 51 && kode <= 65)
    return {
      label: "Hujan",
      icon: '<i class="fa-solid fa-cloud-rain text-blue-500"></i>',
    };
  if (kode >= 95)
    return {
      label: "Badai",
      icon: '<i class="fa-solid fa-bolt text-yellow-400"></i>',
    };
  return {
    label: "Mendung",
    icon: '<i class="fa-solid fa-cloud text-gray-400"></i>',
  };
}
