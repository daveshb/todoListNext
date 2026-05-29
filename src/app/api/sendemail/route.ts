import nodemailer from "nodemailer";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {

    const {name, email } = await request.json()

    const userMail = process.env.MAIL_USER;
    const passMail = process.env.MAIL_PASS;
    
    if (!name || !email) {

      return NextResponse.json(
        { error: "Faltan datos requeridos para enviar notificación" },
        { status: 400 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: userMail,
        pass: passMail,
      },
    });

    const htmlContent = `
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Nuevo Candidato Registrado</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f5f5f5;
              margin: 0;
              padding: 20px;
            }
            .container {
              max-width: 700px;
              margin: 0 auto;
              background-color: #ffffff;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: #ffffff;
              padding: 40px 20px;
              text-align: center;
            }
            .header h1 {
              margin: 0;
              font-size: 28px;
              font-weight: 600;
            }
            .content {
              padding: 40px 20px;
              color: #333333;
            }
            .info-box {
              background-color: #f0f4ff;
              border-left: 4px solid #667eea;
              padding: 20px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .info-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              border-bottom: 1px solid #e0e0e0;
              font-size: 15px;
            }
            .info-row:last-child {
              border-bottom: none;
            }
            .label {
              font-weight: 600;
              color: #667eea;
              min-width: 150px;
            }
            .value {
              color: #555555;
              text-align: right;
              flex: 1;
            }
            .description-section {
              background-color: #f9f9f9;
              border-left: 4px solid #4caf50;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .description-section h3 {
              margin: 0 0 10px 0;
              color: #4caf50;
              font-size: 14px;
            }
            .description-content {
              color: #666666;
              line-height: 1.6;
              font-size: 14px;
            }
            .footer {
              background-color: #f5f5f5;
              padding: 20px;
              text-align: center;
              font-size: 12px;
              color: #999999;
              border-top: 1px solid #e0e0e0;
            }
            .timestamp {
              color: #999999;
              font-size: 12px;
              margin-top: 15px;
              text-align: right;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1> Nuevo Candidato Registrado</h1>
            </div>
            <div class="content">
              <p>
                Un nuevo candidato se ha registrado en el sistema de votación de Foncor 2026.
              </p>
              
              <div class="info-box">
                <div class="info-row">
                  <span class="label">Nombre Completo:</span>
                  <span class="value"><strong>${name}</strong></span>
                </div>
                <div class="info-row">
                  <span class="label">Cédula:</span>
                  
                </div>
                <div class="info-row">
                  <span class="label">Email:</span>
                  <span class="value"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></span>
                </div>
                <div class="info-row">
                  <span class="label">Teléfono:</span>
                </div>
                <div class="info-row">
                  <span class="label">Zona Electoral:</span>
                </div>
                <div class="info-row">
                  <span class="label">Cargo:</span>
                </div>
                <div class="info-row">
                  <span class="label">Localidad:</span>
                </div>
              </div>

              <div class="timestamp">
                Fecha de registro: ${new Date().toLocaleString("es-ES", {
                  timeZone: "America/Bogota",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </div>
            </div>
            <div class="footer">
             <p>
              &copy; 2026 <a href="https://www.dhb-tech.com/" target="_blank" rel="noopener noreferrer">DHB-TECH</a>.
              Solución digital para la gestión eficiente de asambleas y procesos de votación.
              Todos los derechos reservados.
            </p>
            </div>
          </div>
        </body>
      </html>
    `;

    await transporter.sendMail({
      from: '"Bancolombia, confia en mi" <no-reply@bacolombia.com>',
      to: email,
      subject: `Nuevo Candidato Registrado:  - Cédula: 12345678`,
      html: htmlContent,
    });

    return NextResponse.json(
      { message: "Notificación al admin enviada exitosamente" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error enviando notificación al admin:", error);
    return NextResponse.json(
      { error: `Error al enviar notificación: ${error}` },
      { status: 500 },
    );
  }
}
