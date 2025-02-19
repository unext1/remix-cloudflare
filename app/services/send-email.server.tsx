import { render } from '@react-email/components';
import { type AppLoadContext } from '@remix-run/cloudflare';
import { Resend } from 'resend';
import { EmailTemplate } from '~/components/templates/email-template';

export const SendMail = async ({ subject, context }: { subject: string; id: string; context: AppLoadContext }) => {
  const resend = new Resend(context.env.RESEND_API_KEY);

  const html = render(<EmailTemplate />);
  // console.log(html);

  return await resend.emails.send({
    from: 'info@lauva.dev',
    to: 'unext1477@gmail.com',
    subject: subject,
    html: html
  });
};
