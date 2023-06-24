// NAVBAR ON CLICK
const navbars = document.querySelectorAll(".container .navbar div");
navbars.forEach((navbar) => {
  navbar.addEventListener("click", (e) => {
    const nav = e.srcElement.classList[0];

    navbars.forEach((navbar) => {
      if (navbar.classList[0] === nav) {
        navbar.classList.add("active");
      } else {
        navbar.classList.remove("active");
      }
    });

    changeSection(e.target.classList[0]);
  });
});

// CHANGE SECTION
const createCont = document.querySelector(".create-container"),
  scannerCont = document.querySelector(".scanner-container");
function changeSection(section) {
  if (section === "create-nav") {
    scannerCont.style.display = "none";
    createCont.style.display = "block";
  } else if (section === "scanner-nav") {
    createCont.style.display = "none";
    scannerCont.style.display = "block";
  }
}

// USER INPUT AUTO HEIGHT
let message = "";
const userInput = document.getElementById("userInput"),
  userInputPlaceholder = document.querySelector(".input-section .placeholder");
userInput.addEventListener("input", (e) => {
  userInput.style.height = "auto";
  const theHeight = e.target.offsetHeight;
  if (theHeight > 200) {
    userInput.style.height = `${theHeight}px`;
  } else {
    userInput.style.height = "200px";
  }

  message = userInput.textContent;
  checkPlaceholder(userInput.textContent.length);
});
userInput.addEventListener("paste", (e) => {
  e.preventDefault(); // Mencegah aksi paste default
  const pastedText = (e.originalEvent || e).clipboardData.getData("text/plain");
  // Menyisipkan teks dengan gaya ke dalam div
  document.execCommand("insertHTML", false, "<span style='font-family: nunito-medium;'>" + pastedText + "</span>");
  // userInput.textContent = userInput.textContent + pastedText;
});

// USER INPUT PLACEHOLDER
function checkPlaceholder(length) {
  const theDisplay = length > 0 ? "none" : "block";
  userInputPlaceholder.style.display = theDisplay;
}

// SHOW RESULT SECTION
const btnCreate = document.querySelector(".input-section .btn-create"),
  resultSec = document.querySelector(".result-section"),
  result = document.getElementById("result");
btnCreate.addEventListener("click", () => {
  processData("black", "white").then((e) => {
    if (e === "work") {
      resultSec.style.display = "grid";
      result.scrollIntoView({ behavior: "smooth" });
    } else {
      alert("failed! please try again!");
    }
  });
});

// FETCH API
async function processData(fillClr, bgClr) {
  const url = "/generate-qrcode"; // URL endpoint Python
  const data = { message, fillClr, bgClr }; // Data yang akan dikirim

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const dataFromPy = await response.json();
    result.innerHTML = dataFromPy.svgPath;
    return "work";
  } catch (error) {
    return "err";
  }
}

// DOWNLOAD BUTTON
const downloadBtn = document.querySelector(".result-section button");
downloadBtn.addEventListener("click", () => {
  const svgResult = document.querySelector(".result svg");

  domtoimage.toBlob(svgResult).then(function (blob) {
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = "qrcode-manager.png";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  });
});

// CUSTOMIZE
const [fillClr, bgClr] = [document.getElementById("fill-clr"), document.getElementById("bg-clr")];
fillClr.addEventListener("input", (e) => {
  const resultPath = document.getElementById("qr-path");
  resultPath.style.fill = e.target.value;
});
bgClr.addEventListener("input", (e) => {
  const resultSvg = document.querySelector(".result svg");
  resultSvg.style.backgroundColor = e.target.value;
});

window.scrollTo({ top: 500 });
