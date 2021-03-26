import sys
import pandas as pd
from sqlalchemy import create_engine, log
from datetime import datetime

startTime = datetime.now()
argvList = sys.argv

engine = create_engine("postgresql://postgres:970107@localhost:5432/Dashboard", echo=False)
df = pd.read_csv(f"C:\\Users\\sians\\Downloads\\{ argvList[1] }.csv")
# df = df.apply(lambda col: pd.to_datetime(col, format='%d%b%Y', errors='ignore') 
#               if col.dtypes == object 
#               else col, 
#               axis=0)
df.to_sql(str(argvList[1]), con=engine, if_exists='replace')

print(df)
print("Success in " , datetime.now() - startTime)