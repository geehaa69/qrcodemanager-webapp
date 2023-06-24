from flask import Flask, render_template, jsonify, request
import qrcode
from qrcode.image.svg import SvgPathImage
import xml.etree.ElementTree as ET
# import base64
# import io

app = Flask(__name__)

@app.route("/", methods=["POST", "GET"])
def hello_world():
  return render_template("index.html")

@app.post("/generate-qrcode")
def generate_qrcode():
  text = request.json["message"]
  fill_color = request.json["fillClr"]
  bg_color = request.json["bgClr"]
  
  qr = qrcode.QRCode(version=1, error_correction=qrcode.constants.ERROR_CORRECT_M, box_size=10)
  qr.add_data(text)
  qr.make(fit=True)

  img = qr.make_image(fill_color=fill_color, back_color=bg_color, image_factory=SvgPathImage)
  svg_code = img.get_image()
  svg_code = ET.tostring(svg_code, encoding="utf-8").decode()

  # Konversi gambar menjadi data URL
  # img = qr.make_image(fill_color=fill_color, back_color=bg_color)
  # buffered = io.BytesIO()
  # img.save(buffered, format='PNG')
  # img_str = base64.b64encode(buffered.getvalue()).decode('utf-8')
  # data_url = 'data:image/png;base64,' + img_str
  # data_url = {"message": data_url}

  return jsonify({"svgPath": svg_code})

if __name__ == '__main__':
  app.run(debug=False, port=5000)