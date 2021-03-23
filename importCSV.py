import pandas as pd
from sqlalchemy import create_engine, log
from datetime import datetime

startTime = datetime.now()

engine = create_engine("postgresql://postgres:970107@localhost:5432/Dashboard", echo=False)
df = pd.read_csv("C:\\Users\\sians\\Downloads\\newData.csv", )
# df = df.apply(lambda col: pd.to_datetime(col, format='%d%b%Y', errors='ignore') 
#               if col.dtypes == object 
#               else col, 
#               axis=0)
df.to_sql("newData", con=engine, if_exists='replace')

print("Success in " , datetime.now() - startTime)