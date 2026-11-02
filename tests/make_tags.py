"""Render synthetic shelf price-tag images for the OCR pipeline test."""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import json, os, random
random.seed(7)
B='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
R='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
for f in ('/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf',):
    if os.path.exists(f): B2=f
def F(p,s): return ImageFont.truetype(p,s)
out=os.path.join(os.path.dirname(__file__),'tags'); exp={}

def save(name, im, price):
    im.convert('RGB').save(os.path.join(out,name+'.png')); exp[name]=price

# 1 plain white tag with unit price
im=Image.new('RGB',(800,450),'white'); d=ImageDraw.Draw(im)
d.text((30,25),'KELLOGGS FROSTED FLAKES',font=F(B,34),fill='black')
d.text((30,70),'13.5 OZ',font=F(R,26),fill='black')
d.text((260,140),'$4.79',font=F(B,150),fill='black')
d.text((30,370),'UNIT PRICE $0.35 PER OZ',font=F(R,26),fill='black')
d.text((520,370),'0 38000 12345 6',font=F(R,22),fill='black')
save('01_plain_unit', im, 4.79)

# 2 superscript cents
im=Image.new('RGB',(800,450),(250,250,245)); d=ImageDraw.Draw(im)
d.text((30,25),'WHOLE MILK 1 GAL',font=F(B,36),fill='black')
d.text((210,120),'$',font=F(B,90),fill='black')
d.text((280,100),'3',font=F(B,230),fill='black')
d.text((440,120),'49',font=F(B,100),fill='black')
d.text((30,380),'Unit price 2.7¢ per fl oz',font=F(R,26),fill='black')
save('02_superscript', im, 3.49)

# 3 yellow sale tag 2/$5
im=Image.new('RGB',(800,450),(255,214,0)); d=ImageDraw.Draw(im)
d.rectangle([0,0,800,80],fill=(200,16,46)); d.text((300,12),'SALE',font=F(B,52),fill='white')
d.text((30,95),'Barilla Pasta 16 oz',font=F(B,36),fill='black')
d.text((150,160),'2/$5',font=F(B,170),fill=(200,16,46))
d.text((30,390),'Reg $3.29  Save up to $1.58 on 2',font=F(R,26),fill='black')
save('03_yellow_multibuy', im, 2.50)

# 4 red tag white text
im=Image.new('RGB',(800,450),(190,20,30)); d=ImageDraw.Draw(im)
d.text((30,30),'GROUND BEEF 80/20',font=F(B,38),fill='white')
d.text((180,130),'$4.49',font=F(B,160),fill='white')
d.text((520,330),'per lb',font=F(B,40),fill='white')
save('04_red_inverted', im, 4.49)

# 5 photo-like: rotated, blurred, glare gradient, noise
im=Image.new('RGB',(800,450),'white'); d=ImageDraw.Draw(im)
d.text((30,25),'CHEERIOS 18 OZ',font=F(B,38),fill=(30,30,30))
d.text((200,120),'$5.29',font=F(B,160),fill=(25,25,25))
d.text((30,370),'$0.29/oz',font=F(R,28),fill=(40,40,40))
im=im.rotate(4,expand=True,fillcolor=(120,110,100))
g=Image.new('L',im.size,0); gd=ImageDraw.Draw(g)
for i in range(120): gd.ellipse([500-i*2,40-i,700+i*2,200+i],fill=max(0,120-i))
im=Image.composite(Image.new('RGB',im.size,'white'),im,g.filter(ImageFilter.GaussianBlur(30)))
px=im.load()
for _ in range(25000):
    x=random.randrange(im.width); y=random.randrange(im.height); v=random.randint(-40,40); r,gg,b=px[x,y]
    px[x,y]=(max(0,min(255,r+v)),max(0,min(255,gg+v)),max(0,min(255,b+v)))
im=im.filter(ImageFilter.GaussianBlur(1.6)).resize((640,380))
save('05_photo_glare_blur', im, 5.29)

# 6 cents tag
im=Image.new('RGB',(600,350),'white'); d=ImageDraw.Draw(im)
d.text((30,20),'BANANAS',font=F(B,40),fill='black')
d.text((150,90),'59¢',font=F(B,160),fill='black')
d.text((380,270),'per lb',font=F(B,36),fill='black')
save('06_cents_lb', im, 0.59)

# 7 reg vs sale
im=Image.new('RGB',(800,450),'white'); d=ImageDraw.Draw(im)
d.rectangle([0,0,800,70],fill=(0,90,170)); d.text((30,12),'MEMBER PRICE',font=F(B,40),fill='white')
d.text((30,85),'Tide Pods 42 ct',font=F(B,36),fill='black')
d.text((180,150),'$11.99',font=F(B,140),fill='black')
d.text((30,380),'Reg $14.99   You Save $3.00',font=F(R,28),fill='black')
save('07_member_reg_save', im, 11.99)

# 8 small low-res tag (as a far-away snap)
im=Image.new('RGB',(800,450),'white'); d=ImageDraw.Draw(im)
d.text((30,25),'Corn Tortillas 30 ct',font=F(B,38),fill='black')
d.text((220,130),'$2.99',font=F(B,150),fill='black')
im=im.resize((260,146)).filter(ImageFilter.GaussianBlur(0.6))
save('08_lowres', im, 2.99)

# 9 "3 FOR $10" with dark-green band
im=Image.new('RGB',(800,450),'white'); d=ImageDraw.Draw(im)
d.rectangle([0,0,800,75],fill=(0,100,60)); d.text((30,12),'DIGITAL COUPON',font=F(B,40),fill='white')
d.text((30,90),'Goya Black Beans 15.5 oz',font=F(B,34),fill='black')
d.text((90,170),'3 FOR $10',font=F(B,120),fill='black')
d.text((30,385),'$0.22 per oz',font=F(R,26),fill='black')
save('09_3for10', im, 3.33)

# 10 glossy: strong specular glare stripe across the digits, slight perspective, blur
im=Image.new('RGB',(800,450),(245,245,240)); d=ImageDraw.Draw(im)
d.text((30,25),'FRESH STRAWBERRIES 1 LB',font=F(B,34),fill='black')
d.text((210,120),'$3.99',font=F(B,160),fill=(20,20,20))
g=Image.new('L',im.size,0); gd=ImageDraw.Draw(g); gd.polygon([(380,0),(470,0),(330,450),(240,450)],fill=235)
im=Image.composite(Image.new('RGB',im.size,'white'),im,g.filter(ImageFilter.GaussianBlur(18)))
im=im.transform(im.size,Image.PERSPECTIVE,(1,0.08,-20,0.02,1,-10,0.0001,0.0002),fillcolor=(90,90,90)).filter(ImageFilter.GaussianBlur(1.2))
save('10_glossy_glare_stripe', im, 3.99)

json.dump(exp,open(os.path.join(out,'expected.json'),'w'),indent=1)
print(exp)
