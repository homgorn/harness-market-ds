import urllib.request, urllib.parse, json
SEP = "\n\u241E\n"
qs = ["Plugin memory for dsh.", "Secure memory plugin.", "Themes for the web UI."]
params = [('client','gtx'),('sl','en'),('tl','ru'),('dt','t'),('q', SEP.join(qs))]
url = 'https://translate.googleapis.com/translate_a/single?' + urllib.parse.urlencode(params)
with urllib.request.urlopen(url, timeout=30) as r:
    d = json.loads(r.read().decode('utf-8'))
text = ''.join(x[0] for x in d[0])
parts = text.split(SEP.strip())
print('segments in:', len(qs), 'out:', len(parts))
for i,p in enumerate(parts):
    print(i, p.encode('utf-8').decode('utf-8')[:50].encode('ascii','replace').decode())
