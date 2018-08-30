import csv
import json
import sys


def process(data, airports):
    for row in data:
        row['Airline Name'] = row['Airline Name'].strip()

        code = row['Airport Code']
        if code in airports:
            row['lat'] = airports[row['Airport Code']]['lat']
            row['lon'] = airports[row['Airport Code']]['lon']

        inc_date = row['Incident Date']
        fields = inc_date.split()
        if len(fields) == 1:
            date = fields[0]
            time = None
        elif len(fields) == 2:
            date, time = fields
        else:
            raise RuntimeError(inc_date)

        row['Incident Date'] = date
        row['Incident Time'] = time

    return filter(lambda x: x['Airport Code'] in airports, data)


def facet(data, f):
    table = {}

    for d in data:
        label = f(d)

        if label not in table:
            table[label] = []

        table[label].append(d)

    return table


def compute_value(series):
    return sum(map(lambda x: float(x) if x != '-' else 0, map(lambda x: x['Close Amount'], series)))


def aggregate(series):
    first = series[0]

    airport = {'Airport Name': first['Airport Name'],
               'Airport Code': first['Airport Code'],
               'lat': float(first['lat']),
               'lon': float(first['lon'])}

    agg = {'counts': {},
           'values': {}}

    faceted = facet(series, lambda x: x['Disposition'])

    total_count = 0
    for k in faceted:
        kk = k if k != '-' else 'Open'

        agg['counts'][kk] = len(faceted[k])
        agg['values'][kk] = compute_value(faceted[k])

        total_count += len(faceted[k])

    return (agg, total_count, airport)

def csv2dict(filename):
    with open(filename) as f:
        reader = csv.reader(f)

        header = reader.next()

        rows = list(reader)

        return map(lambda row: {k: v for k, v in zip(header, row)}, rows)


def concatenate(lists):
    return reduce(lambda a, b: a + b, lists, [])


def main():
    with open(sys.argv[1]) as f:
        airport_data = json.loads(f.read())

    data = process(concatenate(map(csv2dict, sys.argv[2:])), airport_data)

    facet1 = facet(data, lambda x: x['Airport Code'])

    facet2 = {k: facet(v, lambda x: '/'.join(x['Incident Date'].split('/')[:2])) for k, v in facet1.iteritems()}

    for k in facet2:
        total = 0
        for kk in facet2[k]:
            agg, count, airport = aggregate(facet2[k][kk])

            total += count
            facet2[k][kk] = agg
        facet2[k]['total'] = total
        facet2[k]['airport'] = airport

    # print json.dumps(data, indent=2)

    print json.dumps(facet2, indent=2)


if __name__ == '__main__':
    sys.exit(main())
