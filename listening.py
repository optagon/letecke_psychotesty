import gtts
import random, pyttsx3

final_list = []


def Listening():
    list_of_results = []

    for x in range(10):

        text_speech = pyttsx3.init()

        letters_small = ['A B', 'A C', 'A B C', 'R T U', 'O K R', 'O R T', 'U T Z']
        letters_large = ['B C', 'C D', 'O K','R T O', 'C R T', 'T R']

        letter1 = [letters_small[random.randint(0,6)], letters_large[random.randint(0,5)]]
        letter2 = [letters_small[random.randint(0,6)], letters_large[random.randint(0,5)]]
        generator1 = random.randint(0,1)
        generator2 = random.randint(0,1)


        prvni_pismena = letter1[generator1]
        druhy_pismena = letter2[generator2]


        if prvni_pismena == 'A B' or prvni_pismena == 'A C' or prvni_pismena == 'A B C' or prvni_pismena == 'R T U' or prvni_pismena == 'O K R' or prvni_pismena == 'O R T' or prvni_pismena == 'U T Z':
            prvni_cislo = random.randint(1,37)
        elif prvni_pismena == 'B C' or prvni_pismena =='C D' or prvni_pismena == 'O K' or prvni_pismena == 'R T O' or prvni_pismena == 'C R T' or prvni_pismena == 'T R':
            prvni_cislo = random.randint(38,74)

        if druhy_pismena == 'A B' or druhy_pismena == 'A C' or druhy_pismena == 'A B C' or druhy_pismena == 'R T U' or druhy_pismena == 'O K R' or druhy_pismena == 'O R T' or druhy_pismena == 'U T Z':
            druhy_cislo =  random.randint(1,37)
        elif druhy_pismena == 'B C' or druhy_pismena == 'C D' or druhy_pismena == 'O K' or druhy_pismena == 'R T O' or druhy_pismena == 'C R T' or druhy_pismena == 'T R':
            druhy_cislo = random.randint(38,74)


        kombinace = prvni_cislo, druhy_cislo, prvni_pismena, druhy_pismena
        result = prvni_cislo, prvni_pismena, druhy_cislo, druhy_pismena
        list_of_results.append(result)
        tts = gtts.gTTS(str(kombinace), lang="cs")
        tts.save('./static/sounds/sound'+str(x)+'.mp3')

    return [kombinace, list_of_results]




