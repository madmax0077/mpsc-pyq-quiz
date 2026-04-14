import easyocr
import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

reader = easyocr.Reader(['mr', 'en'], gpu=False)
result = reader.readtext('topic_pages/t34_p1.png', detail=0, paragraph=True)
for line in result:
    print(line)
