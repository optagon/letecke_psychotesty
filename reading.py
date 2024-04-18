import random

def Reading():
    letters_small = ['AB', 'AC', 'ABC', 'RTU', 'OKR', 'ORT', 'UTZ']
    letters_large = ['BC', 'CD', 'OK','RTO', 'CRT', 'TR']

    letter1 = [letters_small[random.randint(0,6)], letters_large[random.randint(0,5)]]

    letter2 = [letters_small[random.randint(0,6)], letters_large[random.randint(0,5)]]

    generator1 = random.randint(0,1)
    generator2 = random.randint(0,1)

    first_letter = letter1[generator1]
    second_letter = letter2[generator2]


    if first_letter == 'AB' or first_letter == 'AC' or first_letter == 'ABC' or first_letter == 'RTU' or first_letter == 'OKR' or first_letter == 'ORT' or first_letter == 'UTZ':
        first_number = random.randint(1,37)
    elif first_letter == 'BC' or first_letter =='CD' or first_letter == 'OK' or first_letter == 'RTO' or first_letter == 'CRT' or first_letter == 'TR':
        first_number = random.randint(38,74)

    if second_letter == 'AB' or second_letter == 'AC' or second_letter == 'ABC' or second_letter == 'RTU' or second_letter == 'OKR' or second_letter == 'ORT' or second_letter == 'UTZ':
        second_number =  random.randint(1,37)

    elif second_letter == 'BC' or second_letter == 'CD' or second_letter == 'OK' or second_letter == 'RTO' or second_letter == 'CRT' or second_letter == 'TR':
        second_number = random.randint(38,74)

    reading = [first_number, second_number, first_letter, second_letter]

    return reading

def Combination(first_number, second_number, first_letter, second_letter):
    combination = str(first_number) + ' ' + str(second_number) + ' ' + first_letter + ' ' + second_letter
    return combination

def Result(first_number, second_number, first_letter, second_letter):
    result = []
    #result = str(first_number) + first_letter + ' ' + str(second_number) + second_letter
    result.append(str(first_number) + first_letter )
    result.append(str(second_number) + second_letter)
    print("from the reading", result)
    return result
