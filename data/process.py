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

    return filter(lambda x: x['Airport Code'] in airports, data)


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

    print json.dumps(data, indent=2)


if __name__ == '__main__':
    sys.exit(main())
