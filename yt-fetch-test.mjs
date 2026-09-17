import { Innertube, Platform } from 'youtubei.js';

Platform.shim.eval = async (data) => new Function(data.output)();

const yt = await Innertube.create({ retrieve_player: true });

async function probe(id, client) {
  const info = await yt.getBasicInfo(id, client ? { client } : undefined);
  const all = [...(info.streaming_data?.formats||[]), ...(info.streaming_data?.adaptive_formats||[])];
  const fmt = all.find(f => f.itag === 18) || all.find(f => f.has_audio && f.has_video) || all.find(f => f.itag === 140);
  if (!fmt) {
    console.log(id, client, 'no format');
    return;
  }
  let url;
  try {
    url = await fmt.decipher(yt.session.player);
  } catch (e) {
    console.log(id, client, 'decipher fail', e.message, 'has_url', Boolean(fmt.url), 'cipher', Boolean(fmt.signature_cipher||fmt.cipher));
    return;
  }
  const res = await fetch(url, { headers: { Range: 'bytes=0-1023' }, redirect: 'follow' });
  const text = res.status !== 206 && res.status !== 200 ? await res.text().catch(()=>'') : '';
  console.log(id, client || 'default', 'itag', fmt.itag, res.status, res.headers.get('content-type'), (text||'').slice(0, 80));

  // session fetch
  try {
    const res2 = await yt.session.http.fetch_function(url, {
      method: 'GET',
      headers: { Range: 'bytes=0-1023' },
      redirect: 'follow',
    });
    console.log('  session.fetch', res2.status, res2.headers.get('content-type'));
    await res2.body?.cancel();
  } catch (e) {
    console.log('  session.fetch fail', e.message);
  }
  await res.body?.cancel();
}

await probe('dQw4w9WgXcQ', 'MWEB');
await probe('dQw4w9WgXcQ', undefined);
await probe('aqz-KE-bpKQ', 'MWEB');
