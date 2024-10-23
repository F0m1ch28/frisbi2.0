import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from config import config

def generate_email_text(email: str, code: int) -> str:
    with open(config.EMAIL_TEMPLATE, 'rt', encoding="utf-8") as file:
        template = file.read()
    template = template.replace('@email@', email)
    template = template.replace('@code@', str(code))
    return template

def send_email(template: str, email: str) -> bool:
    message = MIMEMultipart()
    message["From"] = config.SENDER_EMAIL
    message["To"] = email
    message["Subject"] = "Верификация email адреса пользователя"
    message.attach(MIMEText(template, "html"))

    try:
        server = smtplib.SMTP_SSL(config.SMTP_SERVER, config.PORT)
        server.login(config.SENDER_EMAIL, config.SENDER_EMAIL_PASSWORD)
        server.sendmail(config.SENDER_EMAIL, email, message.as_string())
        return True
    except Exception as e:
        return False
    finally:
        try:
            server.quit()
        except Exception as e:
            print(f"Ошибка при завершении соединения: {e}")
