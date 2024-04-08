const letterMap = new Map<string, string>();
letterMap.set('ё', 'yo');
letterMap.set('й', 'i');
letterMap.set('ц', 'ts');
letterMap.set('у', 'u');
letterMap.set('к', 'k');
letterMap.set('е', 'e');
letterMap.set('н', 'n');
letterMap.set('г', 'g');
letterMap.set('ш', 'sh');
letterMap.set('щ', 'sch');
letterMap.set('з', 'z');
letterMap.set('х', 'h');
letterMap.set('ъ', "'");
letterMap.set('ф', 'f');
letterMap.set('ы', 'i');
letterMap.set('в', 'v');
letterMap.set('а', 'a');
letterMap.set('п', 'p');
letterMap.set('р', 'r');
letterMap.set('о', 'o');
letterMap.set('л', 'l');
letterMap.set('д', 'd');
letterMap.set('ж', 'zh');
letterMap.set('э', 'e');
letterMap.set('я', 'ya');
letterMap.set('ч', 'ch');
letterMap.set('с', 's');
letterMap.set('м', 'm');
letterMap.set('и', 'i');
letterMap.set('т', 't');
letterMap.set('ь', "'");
letterMap.set('б', 'b');
letterMap.set('ю', 'yu');

export const cyrillicSlug = (word: string) => {
    let answer: string = '';
    word = word.toLowerCase();

    for (const letter of word) {
        const mapLetter = letterMap.get(letter);
        if (mapLetter === undefined) {
            answer += letter;
            continue;
        }
        answer += mapLetter;
    }

    return answer.replace(/[^\w ]+/g, '').replace(/ +/g, '-');
};
