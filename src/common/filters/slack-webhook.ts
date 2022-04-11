import * as superagent from 'superagent';

export async function sendErrorWebHook(error: Error, titleMessage?: string) {
  if (process.env.NODE_ENV !== 'production') return;

  const attachment = {
    pretext: `⚠️ ${error.name}`,
    color: '#FF0000',
    text: error.message,
    fields: [{ title: titleMessage ?? 'STACK', value: error.stack, short: false }],
  };
  await superagent.post(process.env.SLACK_REMOTE_CHANNEL).send({ attachments: [attachment] });
}
