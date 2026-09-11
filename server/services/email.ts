import { Resend } from 'resend'

type AuthEmail = {
  action: string
  intro: string
  subject: string
  to: string
  url: string
}

let resend: Resend | undefined

function getEmailClient() {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    throw new Error('RESEND_API_KEY is required to send authentication emails')
  }

  resend ??= new Resend(apiKey)
  return resend
}

function getEmailFrom() {
  const emailFrom = process.env.EMAIL_FROM

  if (!emailFrom) {
    throw new Error('EMAIL_FROM is required to send authentication emails')
  }

  return emailFrom
}

function escapeHtml(value: string) {
  return value.replace(
    /[&<>'"]/g,
    (character) =>
      ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      })[character]!
  )
}

function logLocalEmail({ action, subject, to, url }: AuthEmail) {
  console.info(`
┌─ Hoot local email ─────────────────────────────────────────
│ To: ${to}
│ Subject: ${subject}
│ ${action}: ${url}
└─────────────────────────────────────────────────────────────
`)
}

async function sendAuthEmail({ action, intro, subject, to, url }: AuthEmail) {
  if (process.env.NODE_ENV !== 'production') {
    logLocalEmail({ action, intro, subject, to, url })
    return
  }

  const safeUrl = escapeHtml(url)
  const logo = await useStorage('assets:email').getItemRaw<Uint8Array>('hoot-logo.png')

  if (!logo) {
    throw new Error('Hoot email logo is missing from server assets')
  }

  const { error } = await getEmailClient().emails.send({
    from: getEmailFrom(),
    to,
    subject,
    attachments: [
      {
        content: Buffer.from(logo),
        filename: 'hoot-logo.png',
        contentType: 'image/png',
        contentId: 'hoot-logo'
      }
    ],
    text: `${intro}\n\n${url}\n\nIf you did not request this, you can ignore this email.`,
    html: `
      <div style="margin:0;background:#0d0e11;padding:40px 20px;color:#f5f5f7;font-family:Arial,sans-serif">
        <div style="margin:0 auto;max-width:520px;border:1px solid #292a30;border-radius:16px;background:#15161b;padding:32px">
          <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 28px;border:0">
            <tr>
              <td style="padding:0 10px 0 0;vertical-align:middle">
                <img src="cid:hoot-logo" alt="" width="36" height="36" style="display:block;width:36px;height:36px;border:0;border-radius:9px" />
              </td>
              <td style="padding:0;color:#ff7a45;font-size:24px;font-weight:800;letter-spacing:-1px;vertical-align:middle">hoot</td>
            </tr>
          </table>
          <h1 style="margin:0 0 12px;font-size:26px;line-height:1.2">${escapeHtml(subject)}</h1>
          <p style="margin:0 0 28px;color:#b6b8c0;font-size:15px;line-height:1.7">${escapeHtml(intro)}</p>
          <a href="${safeUrl}" style="display:inline-block;border-radius:9px;background:#ff7a45;padding:13px 18px;color:#20140e;font-size:15px;font-weight:700;text-decoration:none">${escapeHtml(action)}</a>
          <p style="margin:28px 0 0;color:#7f828d;font-size:12px;line-height:1.6">If you did not request this, you can ignore this email.</p>
        </div>
      </div>
    `
  })

  if (error) {
    throw new Error(`Resend rejected an authentication email: ${error.message}`)
  }
}

export function sendPasswordResetEmail(to: string, url: string) {
  return sendAuthEmail({
    action: 'Choose a new password',
    intro:
      'Use the button below to choose a new password for your Hoot account. This link expires in one hour.',
    subject: 'Reset your Hoot password',
    to,
    url
  })
}

export function sendVerificationEmail(to: string, url: string) {
  return sendAuthEmail({
    action: 'Verify my email',
    intro:
      'Confirm that this email address belongs to you before you start using your Hoot account.',
    subject: 'Verify your Hoot email',
    to,
    url
  })
}
