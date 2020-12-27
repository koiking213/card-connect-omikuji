# coding: utf-8
import os
import requests
import re
from html.parser import HTMLParser
from datetime import datetime
from config import COOKIES, WEBHOOK_URL

TOP_URL = "https://p.eagate.573.jp/game/card_connect/1/omikuji/index.html"
OMIKUJI_URL = "https://p.eagate.573.jp/game/card_connect/1/omikuji/exe.html&token_val="


class Parser(HTMLParser):
    def __init__(self):
        HTMLParser.__init__(self)
        self.token = ""

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'a' and 'href' in attrs:
            url = attrs['href']
            if url.startswith("/game/card_connect/1/omikuji/exe.html"):
                self.token = url.split("=")[1]


r = requests.get("{}?gtype={}".format(TOP_URL, type), cookies=COOKIES)
r.encoding = r.apparent_encoding

parser = Parser()
parser.feed(r.text)
parser.close()
print("token is " + parser.token)

r = requests.get("{}?gtype={}".format(OMIKUJI_URL+parser.token, type), cookies=COOKIES)
if r.url.startswith('https://p.eagate.573.jp/game/card_connect/1/error/commonerror.html'):
    message = "おみくじ失敗..."
else:
    result= re.search(r'connect_power=[0-9]+', r.url).group().split("=")[1]
    message = "おみくじの結果、" + result + "のコネクトパワーをget!"
body = {"content": datetime.now().strftime("%Y/%m/%d %H:%M ") + message}
requests.post(WEBHOOK_URL, body)
