const container = document.querySelector(".container");
const btn = document.getElementById("submit");
const errMsg = document.getElementById("error");
const leaderBordBtn = document.getElementById("openLeader");
const dialog = document.querySelector("dialog");
const closeDialog = document.getElementById("close");
const picture = document.querySelector(".picture");
const imgList = document.querySelectorAll(".picture img");
let countList = 0;
let isAnimating = false;
const loadingOverlay = document.getElementById("loadingOverlay");
const unlockPass = document.querySelector(".unlock-pass")
const lockPass = document.querySelector(".lock-pass")

const checkSever = async () => {

    const msgs = [
    "⚔️ กำลังต่อสู้กับ bug...",
    "🧙 casting mongoose.connect()...",
    "🐉 สู้กับ dragon ชื่อ ECONNREFUSED...",
    "✨ กำลังเรียก server ให้ตื่น...",
    "🏆 เกือบแล้ว อย่าหนีไปไหน..."
    ]

    let i = 0;
    const loadingText = document.getElementById("textloading");
    
    const interval = setInterval(() => {
    loadingText.innerText = msgs[i % msgs.length];
    i++;
    }, 2000);

    const res = await fetch("https://kuaitunv3.onrender.com/health");
    const data = await res.json();

    if (data.success) {
        clearInterval(interval);
        loadingOverlay.style.display = "none";
        container.style.visibility = "visible";
    }
}
checkSever()

lockPass.addEventListener("click", () => {
    const typePass = document.getElementById("password")
    const newtype = typePass.getAttribute("type") === "password" ? "text" : "password";
    typePass.setAttribute("type", newtype);
    if (newtype === "text") {
        unlockPass.style.display = "block";
        lockPass.style.display = "none";
    } else {
        unlockPass.style.display = "none";
        lockPass.style.display = "block";
    }
})

unlockPass.addEventListener("click", () => {
    const typePass = document.getElementById("password")
    const newtype = typePass.getAttribute("type") === "password" ? "text" : "password";
    typePass.setAttribute("type", newtype);
    if (newtype === "text") {
        unlockPass.style.display = "none";
        lockPass.style.display = "block";
    } else {
        unlockPass.style.display = "none";
        lockPass.style.display = "block";
    }
})

picture.addEventListener("click", () => {
    if (isAnimating) return;
    isAnimating = true;

    const current = imgList[countList];
    countList = (countList + 1) % imgList.length;
    const next = imgList[countList];

    next.style.opacity = "0";
    next.style.display = "block";

    requestAnimationFrame(() => {
        next.style.transition = "opacity 0.6s ease";
        next.style.opacity = "1";
        current.style.transition = "opacity 0.6s ease";
        current.style.opacity = "0";

        setTimeout(() => {
            current.style.display = "none";
            current.style.opacity = "";
            current.style.transition = "";
            isAnimating = false;
        }, 600);
    });
});

closeDialog.addEventListener("click", () => {
    dialog.classList.add("closing");
    
    dialog.addEventListener("animationend",  handleClose = ()  => {
        dialog.classList.remove("closing");
        dialog.close();
        dialog.removeEventListener("animationend", handleClose);
    }, { once: true });
})

btn.addEventListener("click", async() => {
    try {
        
        const { nameInput, passInput } = {
            nameInput: document.getElementById("name").value,
            passInput: document.getElementById("password").value
        }

        if (nameInput === "" && passInput === "") {
            errMsg.innerText = "คุณท่านก็ใส่ชื่อกับรหัสสิครับ";
            return;
        }

            const res = await fetch("https://kuaitunv3.onrender.com/user/login",{
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify( { nameInput, passInput } )
            })
            const data = await res.json();
            alert(data.msg);
        
    } catch (error) {
        console.error(error);
    }
});

leaderBordBtn.addEventListener("click", async() => {
    try {
        dialog.showModal();
        
    const res = await fetch("https://kuaitunv3.onrender.com/user/api");
    const data = await res.json();

    let userData = "";
    data.forEach((user, index) => {
        userData += `${index + 1}. ${user.name}\n`
    });

    document.getElementById("kuaitunfan").innerText = userData;
    } catch (error) {
        console.error(error);
    }
})

const clearMsg = () => {
    errMsg.innerText = ""
}