import express from "express";
import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import sgMail from "@sendgrid/mail";

const router = express.Router();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const otpStore = {};

router.post("/send-otp", async (req, res) => {
    console.log("กำลังส่ง...")
    try {
        const { name, email } = req.body;
        console.log("body:", req.body);

        const userFind = await User.findOne({ $or: [{ name }, { email }] });
        if (userFind) {
            if (userFind.name === name) {
                return res.json( { msg: "ชื่อมีคนใช้ไปแล้วจร้า" } );
            } else if (userFind.email === email) {
                return res.json( { msg: "อีเมลมีคนใช้ไปแล้วจร้า" } );
            }
        } 

        const otp = String(Math.floor(100000 + Math.random() * 900000));
        otpStore[email] = otp;
        
        await sgMail.send({
            from: process.env.EMAIL,
            to: email,
            subject: "OTP ยืนยันตัวเว็บ KuaitunDemonLord",
            text: `OTP ของคุณคือ: ${otp}`
        });
        console.log("ส่งเสร็จเรียบร้อย✅✅")
        return res.json( { success: true } );
    } catch(error) {
        console.log(error)
        return res.status(500).json({ msg: error.message }) 
    }
})

router.post("/register", async (req, res) => {
    try {
    const { name, pass, email, otp } = req.body;
    
    if (otpStore[email] !== otp) {
            return res.json( { msg: "OTP ไม่ถูกต้อง" } );
        }
    delete otpStore[email];
    
    const hashedPass = await bcrypt.hash(pass, 10)
    const user = new User( { 
        name,
        pass: hashedPass,
        email
     });
    await user.save(); 
    return res.json( { success: true });
    } catch(error) {
        console.error(error); 
        return res.status(500).json({ msg: error.message }) 
    }
});

router.post("/login", async (req, res) => {
    try {
    const { nameInput, passInput } = req.body;
    const userFind = await User.findOne( { name: nameInput } );

    if (!userFind) {
        return res.json( { msg: "ชื่อหรือรหัสไม่ถูกจร้าาา"} );
    }

    const isMatch = await bcrypt.compare(passInput, userFind.pass);

    if (!isMatch) {
        return res.json( { msg: "ชื่อหรือรหัสไม่ถูกจร้าาา" } )
    }
    
    await User.findByIdAndUpdate(userFind._id, { hasLoggedIn: true });

    res.json( { msg: "สมัครเป็นแฟนไข่ตุ๋นสำเร็จ" } );
    }
    catch(error) {
        return res.json( { msg: error.message } )
    }
})

router.get("/api", async (req, res) => {
    try {
        const user = await User.find({ hasLoggedIn: true }).select("-pass"); 
        res.json(user);
    } catch (error) {
        res.status(500).json( { message: error.message } );
    }
});

export default router;