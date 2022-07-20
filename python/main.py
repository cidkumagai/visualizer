import pymysql.cursors
from torch import round_
from transformers import pipeline 
from transformers import AutoModelForSequenceClassification 
from transformers import BertJapaneseTokenizer 
import time
import schedule

def main():
    schedule.every(3).seconds.do(job) # 10秒毎
    while True:
        schedule.run_pending()
        time.sleep(1)
        
def job():
    connection = pymysql.connect(host='localhost',
                                user='root',
                                password='root',
                                db='EXPO',
                                charset='utf8mb4',
                                cursorclass=pymysql.cursors.DictCursor)
    
    try: 
        print('DB処理中')
        with connection.cursor() as cursor:
            sql = "SELECT thought FROM `EXPO`"
            cursor.execute(sql)
            result = cursor.fetchall()
            texts = []
            for i in result:
                texts.append(i['thought'])
            points = judge(texts)
            sql = ('''
                    UPDATE  Emotions
                    SET     positive = %s, negative = %s
                   ''')
            cursor.execute(sql, (points['ポジティブ'],points['ネガティブ']))
            connection.commit()
    finally:
        connection.close()
  
def judge(results):
    # パイプラインの準備
    model = AutoModelForSequenceClassification.from_pretrained('daigo/bert-base-japanese-sentiment') 
    tokenizer = BertJapaneseTokenizer.from_pretrained('cl-tohoku/bert-base-japanese-whole-word-masking') 
    nlp = pipeline("sentiment-analysis", model=model, tokenizer=tokenizer) 
    points = {'ポジティブ':0, 'ネガティブ':0}
    # 感情分析の実行
    for result in results:
        points[(nlp(result)[0]['label'])] += nlp(result)[0]['score']
        
    return points
    
if __name__ == '__main__':
    main()