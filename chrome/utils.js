function addThreeDigitSeparator(number, threeDigitSeparator) {
    if (typeof threeDigitSeparator === "undefined" || threeDigitSeparator === null) {
        threeDigitSeparator = ",";
    }

    number = new String(number);
    var numberLength = number.length;
    
    // jika tidak perlu diberi titik karena digitnya kurang dari 4
    if (numberLength < 4) {
        return number;
    }
    // jika perlu diberi titik
    else {
        // cari banyaknya jumlah titik yang diperlukan
        var numOfDot = Math.floor(numberLength / 3);
        
        if ( numberLength % 3 == 0 ) {
            numOfDot--;
        }

        // tambahkan titik pertama (titik paling kanan)
        var numberMoney = threeDigitSeparator + number.substr(numberLength-3, 3);
        
        // tambahkan titik2 selanjutnya
        for (var count = 1; count < numOfDot; count++) {
            numberMoney = threeDigitSeparator + number.substr(numberLength-(3*(count+1)), 3) + numberMoney;
        }
    
        var head = numberLength % 3;

        // jika angka di sebelah kiri dari titik paling kiri ada 3 digit
        if (head === 0) {
            numberMoney = number.substr(0, 3) + numberMoney;
        }
        // jika angka di sebelah kiri dari titik paling kiri ada 1 atau 2 digit
        else {
            numberMoney = number.substr(0, head) + numberMoney;
        }

        return numberMoney;
    }
}
