require('dotenv').config();
const express = require('express');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

app.post('/api/contact', async (req, res) => {
    const { nombre, email, empresa, telefono, mensaje } = req.body;

    if (!nombre || !email || !mensaje) {
        return res.status(400).json({ ok: false, msg: 'Nombre, email y mensaje son obligatorios' });
    }

    try {
        const html = `
            <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#1a1a2e;color:#e0e0e0;border-radius:12px;overflow:hidden">
                <div style="background:linear-gradient(135deg,#0f3460,#16213e);padding:30px;text-align:center">
                    <h1 style="color:#00d4ff;margin:0;font-size:24px">Nuevo Contacto - CSTM</h1>
                </div>
                <div style="padding:30px">
                    <table style="width:100%;border-collapse:collapse">
                        <tr><td style="padding:8px 0;color:#888;font-weight:bold;width:120px">Nombre</td><td style="padding:8px 0;color:#fff">${nombre}</td></tr>
                        <tr><td style="padding:8px 0;color:#888;font-weight:bold">Email</td><td style="padding:8px 0;color:#00d4ff">${email}</td></tr>
                        ${empresa ? `<tr><td style="padding:8px 0;color:#888;font-weight:bold">Empresa</td><td style="padding:8px 0;color:#fff">${empresa}</td></tr>` : ''}
                        ${telefono ? `<tr><td style="padding:8px 0;color:#888;font-weight:bold">Telefono</td><td style="padding:8px 0;color:#fff">${telefono}</td></tr>` : ''}
                    </table>
                    <hr style="border:none;border-top:1px solid #333;margin:20px 0">
                    <p style="color:#888;font-size:12px;margin:0 0 8px">Mensaje:</p>
                    <p style="color:#e0e0e0;line-height:1.6;background:#16213e;padding:16px;border-radius:8px">${mensaje.replace(/\n/g, '<br>')}</p>
                </div>
                <div style="background:#0f3460;padding:16px;text-align:center">
                    <p style="color:#666;font-size:11px;margin:0">Enviado desde el formulario de contacto de cstm.dev</p>
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: `"CSTM Landing" <${process.env.SMTP_USER}>`,
            to: process.env.CONTACT_EMAIL,
            replyTo: email,
            subject: `Contacto desde la web - ${nombre}`,
            text: `Nombre: ${nombre}\nEmail: ${email}\nEmpresa: ${empresa || '-'}\nTelefono: ${telefono || '-'}\n\nMensaje:\n${mensaje}`,
            html: html
        });

        res.json({ ok: true, msg: 'Mensaje enviado correctamente' });
    } catch (err) {
        console.error('Error email:', err.message);
        res.status(500).json({ ok: false, msg: 'Error al enviar el mensaje. Intenta de nuevo.' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`CSTM Landing corriendo en puerto ${PORT}`);
});
