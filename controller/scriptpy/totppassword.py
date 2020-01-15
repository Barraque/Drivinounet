import hmac, base64, struct, hashlib, time, sys

intervals_no = int(time.time()) // 30
digest_mode = hashlib.sha1
key = base64.b32decode(sys.argv[1])
msg = struct.pack(">Q", intervals_no)
h = hmac.new(key, msg, digest_mode).digest()
o = ord(h[19]) & 15
h = (struct.unpack(">I", h[o:o+4])[0] & 0x7fffffff) % 1000000

print h,
sys.stdout.flush()
