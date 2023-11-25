class Scrapper:
    def scrape():
        from bs4 import BeautifulSoup
        import requests
        import datetime
        import pandas as pd
        url = "https://www.moneycontrol.com/financials/ashokleyland/results/quarterly-results/AL"
        source=requests.get(url)
        soup=BeautifulSoup(source.text,'html')
        table = soup.find('table', class_='mctable1')
        many_tr = table.find_all('tr')
        mappings = {'Jan' : 1, 'Feb' : 2, 'Mar' : 3, 
                    'Apr' : 4, 'May' : 5, 'Jun' : 6,
                    'Jul' : 7, 'Aug' : 8, 'Sep' : 9,
                    'Oct' : 10, 'Nov' : 11, 'Dec' : 12}
        dict = {}
        months = []
        z = 1
        for i in many_tr:
            if(z==1):
                td = i.find_all('td', class_='')
                for j in td:
                    arr = j.text.split(" '")
                    if len(arr)==2:
                        month = mappings[arr[0]]
                        year = arr[1]
                        date = "20"+str(year) + "-" + str(month)
                        months.append(date)
                    months = months[::-1]
                    parsed_dates = [datetime.datetime.strptime(d, '%Y-%m') for d in months]
                    print(parsed_dates)
                    dict['month'] = parsed_dates
                    z = z + 1
                continue
            td = i.find_all('td', class_='')
            y = 1
            values = []
            for j in td:
                if(y==1):
                    key = j.text
                else:
                    if j.text=='--' or j.text=='':
                        values.append(0)
                        continue
                    try:
                        values.append(float(j.text.replace(",","")))
                    except ValueError:
                        values.append(j.text)
                y = y + 1
                y = y % 7
                # print(key, values)
            values = values[::-1]
            dict[key] = values
        df = pd.DataFrame(dict)


        url = "https://www.moneycontrol.com/financials/tatamotors/results/quarterly-results/TM03/2#TM03"
        source=requests.get(url)
        soup=BeautifulSoup(source.text,'html')
        table = soup.find('table', class_='mctable1')
        many_tr = table.find_all('tr')
        months = []
        dict2 = {}
        z = 1
        for i in many_tr:
            if(z==1):
                td = i.find_all('td', class_='')
                for j in td:
                    arr = j.text.split(" '")
                    if len(arr)==2:
                        month = mappings[arr[0]]
                        year = arr[1]
                        date = "20"+str(year) + "-" + str(month)
                        months.append(date)
                    months = months[::-1]
                    parsed_dates = [datetime.datetime.strptime(d, '%Y-%m') for d in months]
                    print(parsed_dates)
                    dict2['month'] = parsed_dates
                    z = z + 1
                    continue
            td = i.find_all('td', class_='')
            y = 1
            values = []
            for j in td:
                if(y==1):
                    key = j.text
                else:
                    if j.text=='--' or j.text=='':
                        values.append(0)
                        continue
                    try:
                        values.append(float(j.text.replace(",","")))
                    except ValueError:
                        values.append(j.text)
                y = y + 1
                y = y % 7
            values = values[::-1]
            dict2[key] = values
        df2 = pd.DataFrame(dict2)


        url = "https://www.moneycontrol.com/financials/tatamotors/results/quarterly-results/TM03/3#TM03"
        source=requests.get(url)
        soup=BeautifulSoup(source.text,'html')
        table = soup.find('table', class_='mctable1')
        many_tr = table.find_all('tr')
        dict3 = {}
        months = []
        z = 1
        for i in many_tr:
            if(z==1):
                td = i.find_all('td', class_='')
                for j in td:
                    arr = j.text.split(" '")
                    if len(arr)==2:
                        month = mappings[arr[0]]
                        year = arr[1]
                        date = "20"+str(year) + "-" + str(month)
                        months.append(date)
                    months = months[::-1]
                    parsed_dates = [datetime.datetime.strptime(d, '%Y-%m') for d in months]
                    print(parsed_dates)
                    dict3['month'] = parsed_dates
                    z = z + 1
                    continue
            td = i.find_all('td', class_='')
            y = 1
            values = []
            for j in td:
                if(y==1):
                    key = j.text
                else:
                    if j.text=='--' or j.text=='':
                        values.append(0)
                        continue
                    try:
                        values.append(float(j.text.replace(",","")))
                    except ValueError:
                        values.append(j.text)
                y = y + 1
                y = y % 7
            values = values[::-1]
            dict3[key] = values
        df3 = pd.DataFrame(dict3)


        url = "https://www.moneycontrol.com/financials/tatamotors/results/quarterly-results/TM03/4#TM03"
        source=requests.get(url)
        soup=BeautifulSoup(source.text,'html')
        table = soup.find('table', class_='mctable1')
        many_tr = table.find_all('tr')
        months = []
        dict4 = {}
        z = 1
        for i in many_tr:
            if(z==1):
                td = i.find_all('td', class_='')
                for j in td:
                    arr = j.text.split(" '")
                    if len(arr)==2:
                        month = mappings[arr[0]]
                        year = arr[1]
                        date = "20"+str(year) + "-" + str(month)
                        months.append(date)
                    months = months[::-1]
                    parsed_dates = [datetime.datetime.strptime(d, '%Y-%m') for d in months]
                    print(parsed_dates)
                    dict4['month'] = parsed_dates
                    z = z + 1
                    continue
            td = i.find_all('td', class_='')
            y = 1
            values = []
            for j in td:
                if(y==1):
                    key = j.text
                else:
                    if j.text=='--' or j.text=='':
                        values.append(0)
                        continue
                    try:
                        values.append(float(j.text.replace(",","")))
                    except ValueError:
                        values.append(j.text)
                y = y + 1
                y = y % 7
            values = values[::-1]
            dict4[key] = values
        df4 = pd.DataFrame(dict4)
        
        vertical_concat = pd.concat([df4, df3, df2, df], axis=0)
        vertical_concat.to_csv('./file1.csv', index=False)
        print("Hello there scrapper")