class Scrapper2:
    def __init__(self):
        pass
    def scrape2(self, company, link):
        from bs4 import BeautifulSoup
        import requests
        import datetime
        import pandas as pd
        mapDict = {
            'Honda' : 'HSP02',
            'TVS' : 'TVS',
            'Force' : 'FM01',
            'Ashok' : 'AL',
            'Mahindra' : 'MM',
            'Bajaj' : 'BA10',
            'Tata' : 'TM03',
            'BMW' : 'BMW54266',
            'Maruti' : 'MS24'
        }
        mappings = {'Jan' : 1, 'Feb' : 2, 'Mar' : 3, 
                    'Apr' : 4, 'May' : 5, 'Jun' : 6,
                    'Jul' : 7, 'Aug' : 8, 'Sep' : 9,
                    'Oct' : 10, 'Nov' : 11, 'Dec' : 12}
        dicts = []
        for every_i in range(0, 18):
            print("hi")
            links = ""
            links = link + "/" + str(every_i+1) + "#" + mapDict[company]
            url = links
            print(url)
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
            dicts.append(df2) 
        dicts = dicts[::-1]
        vertical_concat = pd.concat(dicts)
        vertical_concat.to_csv('./file4.csv', index=False)
        
