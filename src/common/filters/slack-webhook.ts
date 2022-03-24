import * as superagent from 'superagent';
import { BaseResponseDto } from '@common/response-helper/base-response.dto';

export async function sendErrorWebHook(responseData: BaseResponseDto) {
  if (process.env.NODE_ENV !== 'production') return;

  const attachment = {
    pretext: `⚠️ ${responseData.resultData}`,
    color: '#FF0000',
    text: responseData.errorMessage,
    fields: [{ title: '에러 코드', value: responseData.errorCode, short: false }],
  };
  await superagent.post(process.env.SLACK_REMOTE_CHANNEL).send({ attachments: [attachment] });
}
