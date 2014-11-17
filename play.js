// ----- Logic Start -----
/**
 * TODO カード取捨選択
 * @param obj cards
 * @return array throwList ex) [1, 3, 4]
 */
var decideThrowCards = function(cards) {
    return [1, 2, 3, 4, 5];
};

var ajax = function(url, postData, callback) {
    $.ajax({
        type: 'post',
        url: url,
        data:JSON.stringify(postData),  // JSONデータ本体
        contentType: 'application/json', // リクエストの Content-Type
        dataType: 'json',           // レスポンスをJSONとしてパースする
        success: function(json) {
            if (_.isEmpty(json)) {
                callback('Transaction error.');
                return;
            }
            callback(null, json);
        },
        error: function() {
            callback('Server Error. Pleasy try again later.');
        }
    });
};
// ----- Logic End -----


// 全過程の順序を司る
var parentDeferred = new $.Deferred().resolve();

parentDeferred
    .then(function() {
        var dealDeferred = new $.Deferred();
        var url = 'HOGE';
        var postData = { };

        ajax(url, postData, function(err, json) {
            if (err) dealDeferred.reject(err);

            dealDeferred.resolve(json.card_list);
        });

        return dealDeferred;
    })
    .then(function(cards) {
        var drawDeferred = new $.Deferred();
        // カード取捨選択
        var throwList = decideThrowCards(cards);
        var url = 'FOO';
        var postData = { throw_list: throwList };

        ajax(url, postData, function(err, json) {
            if (err) dealDeferred.reject(err);

            drawDeferred.resolve(json.pay_medal);
        });

        return drawDeferred;
    })
    .then(function(payMedal) {
        var doubleStartDeferred = new $.Deferred();
        if (payMedal > 0) {
            // 役が揃った時
            var url = 'HUGA';
            var postData = { };

            ajax(url, postData, function(err, json) {
                if (err) doubleStartDeferred.reject(err);

                doubleStartDeferred.resolve(json.card_first);
            });
        } else {
            // 負けた時は処理を中断
            doubleStartDeferred.reject('Restart Porker because of LOST');
        }

        return doubleStartDeferred;
    })
    .then(function(card) {
        // TODO
    })
    // rejectされた際のcallback(Error, 負けた際)
    .fail(function(message) {
        alert(message);
    });