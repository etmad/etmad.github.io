/* Helpful information:

Clips
	Endpoint: https://api.twitch.tv/kraken/clips/ReliableSplendidInternPogChamp?on_site=1&api_version=5
	Exmpample Clip: https://clips.twitch.tv/ReliableSplendidInternPogChamp
	Missing thumbnail: https://clips-media-assets.twitch.tv/404-preview-86x45.jpg
	Broken thumbnail: https://clips-media-assets.twitch.tv/vod-153090723-offset-1928.5-60-preview-1920x1080.jpg

*/

var cooldown = 0;
const chatEle = document.getElementById('chat');
const twitchBadgeCache = {
  data: { global: {} } };

const bttvEmoteCache = {
  lastUpdated: 0,
  data: { global: [] },
  urlTemplate: '//cdn.betterttv.net/emote/{{id}}/{{image}}' };


const krakenBase = 'https://api.twitch.tv/kraken/';
const krakenClientID = '4g5an0yjebpf93392k4c5zll7d7xcec';

const chatFilters = [
// '\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF', // Partial Latin-1 Supplement
// '\u0100-\u017F', // Latin Extended-A
// '\u0180-\u024F', // Latin Extended-B
'\u0250-\u02AF', // IPA Extensions
'\u02B0-\u02FF', // Spacing Modifier Letters
'\u0300-\u036F' // Combining Diacritical Marks
//'\u0370-\u03FF', // Greek and Coptic
//'\u0400-\u04FF', // Cyrillic
//'\u0500-\u052F', // Cyrillic Supplement
//'\u0530-\u1FFF', // Bunch of non-English
//'\u2100-\u214F', // Letter Like
//'\u2500-\u257F', // Box Drawing
//'\u2580-\u259F', // Block Elements
//	'\u25A0-\u25FF', // Geometric Shapes
//'\u2600-\u26FF', // Miscellaneous Symbols
// '\u2700-\u27BF', // Dingbats
//'\u2800-\u28FF', // Braille
// '\u2C60-\u2C7F', // Latin Extended-C
];
const chatFilter = new RegExp(`[${chatFilters.join('')}]`);

let client;
let testing = true;

if (testing) {
  kraken({
    endpoint: 'streams',
    qs: {
      limit: 10,
      language: 'en' } }).


  then(({ streams }) => {
    client = new tmi.client({
      // options: { debug: true },
      connection: {
        reconnect: true,
        secure: true },

      channels: ['gasmanov_official'] });

    addListeners();
    client.connect();
  });
} else
{
  client = new tmi.client({
    // options: { debug: true },
    connection: {
      reconnect: true,
      secure: true },

    channels: ['gasmanov_official'] });

  addListeners();
  client.connect();
}

function addListeners() {
  client.on('connecting', () => {
    showAdminMessage({
      message: 'Connecting...',
      attribs: { subtype: 'connecting' } });

    removeAdminChatLine({ subtype: 'disconnected' });
  });

  client.on('connected', () => {
    getBadges().
    then(badges => twitchBadgeCache.data.global = badges);
    showAdminMessage({
      message: 'Connected...',
      attribs: { subtype: 'connected' },
      timeout: 5000 });

    removeAdminChatLine({ subtype: 'connecting' });
    removeAdminChatLine({ subtype: 'disconnected' });
  });

  client.on('disconnected', () => {
    twitchBadgeCache.data = { global: {} };
    showAdminMessage({
      message: 'Disconnected...',
      attribs: { subtype: 'disconnected' } });

    removeAdminChatLine({ subtype: 'connecting' });
    removeAdminChatLine({ subtype: 'connected' });
  });

  function handleMessage(channel, userstate, message, fromSelf) {
    if (chatFilter.test(message)) {
      testing && console.log(message);
      return;
    }

    const mark = /\d*[+-]?/g;
    message = message.replace(mark, '');

    if (message == '') return;

    let chan = getChan(channel);
    let name = userstate['display-name'] || userstate.username;
    if (/[^\w]/g.test(name)) {
      name += ` (${userstate.username})`;
    }
    userstate.name = name;
    showMessage({ chan, type: 'chat', message, data: userstate });
  }

  client.on('message', handleMessage);
  client.on('cheer', handleMessage);

  client.on('join', (channel, username, self) => {
    if (!self) {
      return;
    }
    let chan = getChan(channel);
    twitchNameToUser(chan).
    then(user => getBadges(user._id)).
    then(badges => twitchBadgeCache.data[chan] = badges);
    showAdminMessage({
      message: `Joined ${chan}`,
      timeout: 1000 });

  });

  client.on('part', (channel, username, self) => {
    if (!self) {
      return;
    }
    let chan = getChan(channel);
    delete bttvEmoteCache.data[chan];
    showAdminMessage({
      message: `Parted ${chan}`,
      timeout: 1000 });

  });

  client.on('clearchat', channel => {
    removeChatLine({ channel });
  });

  client.on('timeout', (channel, username) => {
    removeChatLine({ channel, username });
  });
}

function removeChatLine(params = {}) {
  if ('channel' in params) {
    params.channel = getChan(params.channel);
  }
  let search = Object.keys(params).
  map(key => `[${key}="${params[key]}"]`).
  join('');
  chatEle.querySelectorAll(search).
  forEach(n => chatEle.removeChild(n));
}

function removeAdminChatLine(params = {}) {
  params.type = 'admin';
  removeChatLine(params);
}

function showAdminMessage(opts) {
  opts.type = 'admin';
  if ('attribs' in opts === false) {
    opts.attribs = {};
  }
  opts.attribs.type = 'admin';
  return showMessage(opts);
}

function getChan(channel = '') {
  return channel.replace(/^#/, '');
}

function showMessage({ chan, type, message = '', data = {}, timeout = 0, attribs = {} } = {}) {
  let chatLine_ = document.createElement('div');
  let chatLine = document.createElement('div');
  chatLine_.classList.add('chat-line');
  chatLine.classList.add('chat-line-inner');
  chatLine_.appendChild(chatLine);

  if (chan) {
    chatLine_.setAttribute('channel', chan);
  }

  Object.keys(attribs).
  forEach(key => {
    chatLine_.setAttribute(key, attribs[key]);
  });

  if (type === 'chat') {
    'id' in data && chatLine_.setAttribute('message-id', data.id);
    'user-id' in data && chatLine_.setAttribute('user-id', data['user-id']);
    'room-id' in data && chatLine_.setAttribute('channel-id', data['room-id']);
    'username' in data && chatLine_.setAttribute('username', data.username);

    let spaceEle = document.createElement('span');
    spaceEle.innerText = ' ';
    let badgeEle = document.createElement('span');
    if ('badges' in data && data.badges !== null) {
      badgeEle.classList.add('badges');
      let badgeGroup = Object.assign({}, twitchBadgeCache.data.global, twitchBadgeCache.data[chan] || {});
      let badges = Object.keys(data.badges).
      forEach(type => {
        let version = data.badges[type];
        let group = badgeGroup[type];
        if (group && version in group.versions) {
          let url = group.versions[version].image_url_1x;
          let ele = document.createElement('img');
          ele.setAttribute('src', url);
          ele.setAttribute('badgeType', type);
          ele.setAttribute('alt', type);
          ele.classList.add('badge');
          badgeEle.appendChild(ele);
        }
      }, []);
    }

    let nameEle = document.createElement('span');
    nameEle.classList.add('user-name');
    nameEle.innerText = data.name;

    let colonEle = document.createElement('span');
    colonEle.classList.add('message-colon');
    colonEle.innerText = ' // ';

    let messageEle = document.createElement('span');
    messageEle.classList.add('message');

    let finalMessage = message;
    addEmoteDOM(messageEle, finalMessage);

    chatLine.appendChild(messageEle);
    chatLine.appendChild(colonEle);
    chatLine.appendChild(nameEle);
  } else
  if (type === 'admin') {
    chatLine_.classList.add('admin');

    let messageEle = document.createElement('span');
    messageEle.classList.add('message');
    messageEle.innerText = message;

    chatLine.appendChild(messageEle);
  }

  if(Date.now() - cooldown < 10000)
	  return;
  cooldown = Date.now();

  chatEle.appendChild(chatLine_);

  setTimeout(() => chatLine_.classList.add('visible'), 100);

  if (chatEle.childElementCount > 1) {
    chatEle.removeChild(chatEle.children[0]);
  }

  if (timeout) {
    setTimeout(() => {
      if (chatLine_.parentElement) {
        chatLine_.classList.remove('visible');
        setTimeout(() => chatEle.removeChild(chatLine_), 1000);
      }
    }, timeout);
  }
}

function formQuerystring(qs = {}) {
  return Object.keys(qs).
  map(key => `${key}=${qs[key]}`).
  join('&');
}

function request({ base = '', endpoint = '', qs, headers = {}, method = 'get' }) {
  let opts = {
    method,
    headers: new Headers(headers) };

  return fetch(base + endpoint + '?' + formQuerystring(qs), opts).
  then(res => res.json());
}

function kraken(opts) {
  let defaults = {
    base: krakenBase,
    headers: {
      'Client-ID': krakenClientID,
      Accept: 'application/vnd.twitchtv.v5+json' } };


  return request(Object.assign(defaults, opts));
}

function twitchNameToUser(username) {
  return kraken({
    endpoint: 'users',
    qs: { login: username } }).

  then(({ users }) => users[0] || null);
}

function getBadges(channel) {
  return kraken({
    base: 'https://badges.twitch.tv/v1/badges/',
    endpoint: (channel ? `channels/${channel}` : 'global') + '/display',
    qs: { language: 'en' } }).

  then(data => data.badge_sets);
}

function getClip(clipSlug) {
  return kraken({
    endpoint: `clips/${clipSlug}` });

}

function getBTTVEmotes(channel) {
  return;
  let endpoint = 'emotes';
  let global = true;
  if (channel) {
    endpoint = 'channels/' + channel;
    global = false;
  }
  return request({
    base: 'https://api.betterttv.net/3/',
    endpoint }).

  then(({ emotes, status, urlTemplate }) => {
    if (status === 404) return;
    bttvEmoteCache.urlTemplate = urlTemplate;
    emotes.forEach(n => {
      n.global = global;
      n.type = ['bttv', 'emote'];
      if (!global) {
        if (channel in bttvEmoteCache.data === false) {
          bttvEmoteCache.data[channel] = [];
        }
        bttvEmoteCache.data[channel].push(n);
      } else
      {
        bttvEmoteCache.data.global.push(n);
      }
    });
  });
}
