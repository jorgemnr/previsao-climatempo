//inicializar
$(document).ready(inicializar);

//variaveis Globais
let caminhoImgPeq = 'img/realistic/45px/';
let caminhoImgGde = 'img/realistic/128px/';
let tokenWs = '724ad8c3f15b9d400ff996a62d058433';

function inicializar() {
    let previsaoMomento, previsao15Dias;
    //obter geolocalização
    geo.obterGeolocalizacao();
    //Chamar web services
    //atualizar pagina html
    atualizarDados();
}


//Objeto para obter geolocalizacao do browser
let geo = {
    coordenadas: null,
    erro: null,

    obterGeolocalizacao() {
        // Verifica se o navegador do usuario tem suporte a geolocalizacao
        if (navigator.geolocation) {
            // Se tiver, solicita os dados e atualiza a previsao do tempo pela API
            navigator.geolocation.getCurrentPosition(sucesso, error);
        } else {
            //Seu navegador não suporta geolocalização
            erro(999);
        }

        function sucesso(dados) {
            //console.log('dados.coords.latitude ' + dados.coords.latitude)
            coordenadas = dados.coords;
        };

        function error(error, msgErro) {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    this.erro = 'User denied the request for Geolocation.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    this.erro = 'Location information is unavailable.';
                    break;
                case error.TIMEOUT:
                    this.erro = 'The request to get user location timed out.';
                    break;
                case error.UNKNOWN_ERROR:
                    this.erro = 'An unknown error occurred.';
                    break;
                default:
                    this.erro = 'Seu navegador não suporta geolocalização.';
                    break;
            }
        };
    }
}

//
//WebService -> Weather - Tempo no momento.
//
function chamaWsMomento(dadosGeo, token, sucesso, erro) {
    $.ajax({
        url: 'https://apiadvisor.climatempo.com.br/api/v1/weather/locale/3477/current?token=' + token,
        dataType: 'json',
        success: function (dados) {
            sucesso = dados;
        },
        error: function (xhr, status, error) {
            erro = 'Ocorreu um erro ao obter previsão Momento!';
        }
    });
}

//
//WebService -> Forecast - Previsão 15 dias.
//
function chamaWsPrevisao(dadosGeo, token, sucesso, erro) {
    $.ajax({
        url: 'https://apiadvisor.climatempo.com.br/api/v1/forecast/locale/3477/days/15?token=' + token,
        dataType: 'json',
        success: function (dados) {
            sucesso = dados;

        },
        error: function (xhr, status, error) {
            erro = 'Ocorreu um erro ao obter previsão 15 dias!';
        }
    });
}

/* 
function atualizarDados(dadosGeo, erroGeo) {
    //localizacao = typeof localizacao !== 'undefined' ? localizacao : false;
    //
    //WebService -> Weather - Tempo no momento.
    //
    let token = '724ad8c3f15b9d400ff996a62d058433';
    $.ajax({
        url: 'https://apiadvisor.climatempo.com.br/api/v1/weather/locale/3477/current?token=' + token,
        dataType: 'json',
        success: function (dados) {
            //console.log(dados)
            //Loop JSON para atualizar pagina
            $.each(dados, function (dado, valor) {
                // Dados do dia corrente
                if (dado !== 'data') {
                    //Cidade / Estado 
                    $('#' + dado).text(valor);
                }
                else {
                    $.each(dados.data, function (dado1, valor1) {
                        if (dado1 == 'temperature') {
                            $('#temperatureMomento').html(valor1 + '&deg;');
                        }
                        else if (dado1 == 'date') {
                            $('#' + dado1).text('Atualizado às ' + valor1.substr(11, 5));
                        }
                        else if (dado1 == 'icon') {
                            //Icone do dia
                            $('#imgMomento').attr('src', caminhoImgGde + valor1 + '.png');
                        }
                    });
                }
            });
        },
        error: function (xhr, status, error) {
            $('#linhaErro').show();
            $('#erro').text("Ocorreu um erro ao obter previsão!");
        }
    });

    //
    //WebService -> Forecast - Previsão 15 dias.
    //
    $.ajax({
        url: 'https://apiadvisor.climatempo.com.br/api/v1/forecast/locale/3477/days/15?token=' + token,
        dataType: 'json',
        success: function (dados) {
            //console.log(dados)
            //Loop JSON para atualizar pagina
            $.each(dados, function (dado, valor) {
                // Dados do dia corrente
                if (dado == 'data') {
                    //console.log(dado)
                    for (let i = 0; i < 7; i++) {
                        //dados dia atual
                        if (i == 0) {
                            //Limpar tabela Previsão 5 Dias
                            $('#tabelaPrevisao5Dias').empty();
                            //
                            $.each(dados.data[i], function (dado1, valor1) {
                                //console.log('dados: ' + dado1)
                                //console.log('valor: ' + valor1)
                                //Chuva
                                if (dado1 == 'rain') {
                                    $('#' + dado1 + 'Momento').text(valor1.probability + '% / ' + valor1.precipitation + 'mm');
                                }
                                //Temperatura
                                else if (dado1 == 'thermal_sensation') {
                                    $('#sensation').html(valor1.min + '&deg;C / ' + valor1.max + '&deg;C');
                                }
                                //Temperatura
                                else if (dado1 == 'temperature') {
                                    $('#' + dado1 + 'MinMax').html(valor1.min + '&deg;C / ' + valor1.max + '&deg;C');
                                }
                                //Movimento do Dia
                                else if (dado1 == 'text_icon') {
                                    //Icones
                                    $('#imgMomentoMadrugada').attr('src', caminhoImgPeq + valor1.icon.dawn + '.png');
                                    $('#imgMomentoManha').attr('src', caminhoImgPeq + valor1.icon.morning + '.png');
                                    $('#imgMomentoTarde').attr('src', caminhoImgPeq + valor1.icon.afternoon + '.png');
                                    $('#imgMomentoNoite').attr('src', caminhoImgPeq + valor1.icon.night + '.png');
                                    //Frases
                                    $('#phrase-dawn').text(valor1.text.phrase.dawn);
                                    $('#phrase-morning').text(valor1.text.phrase.morning);
                                    $('#phrase-afternoon').text(valor1.text.phrase.afternoon);
                                    $('#phrase-night').text(valor1.text.phrase.night);
                                    //Frase completa
                                    $('#phrase-reduced').text(valor1.text.phrase.reduced);
                                }
                            });
                        }
                        else {
                            //Dados previsão 5 dias
                            fncPrevisao5Dias(dados.data[i]);
                        }
                    }
                }
            });
        },
        error: function (xhr, status, error) {
            $('#linhaErro').show();
            $('#erro').text("Ocorreu um erro ao obter previsão!");
        }
    });
} */


/*
//function atualizarDados(localizacao) {
function atualizarDados(dadosGeo, erroGeo) {
    //localizacao = typeof localizacao !== 'undefined' ? localizacao : false;
    //
    //WebService -> Weather - Tempo no momento.
    //
    let token = '724ad8c3f15b9d400ff996a62d058433';
    $.ajax({
        url: 'https://apiadvisor.climatempo.com.br/api/v1/weather/locale/3477/current?token=' + token,
        dataType: 'json',
        success: function (dados) {
            //console.log(dados)
            //Loop JSON para atualizar pagina
            $.each(dados, function (dado, valor) {
                // Dados do dia corrente
                if (dado !== 'data') {
                    //Cidade / Estado 
                    $('#' + dado).text(valor);
                }
                else {
                    $.each(dados.data, function (dado1, valor1) {
                        if (dado1 == 'temperature') {
                            $('#temperatureMomento').html(valor1 + '&deg;');
                        }
                        else if (dado1 == 'date') {
                            $('#' + dado1).text('Atualizado às ' + valor1.substr(11, 5));
                        }
                        else if (dado1 == 'icon') {
                            //Icone do dia
                            $('#imgMomento').attr('src', caminhoImgGde + valor1 + '.png');
                        }
                    });
                }
            });
        },
        error: function (xhr, status, error) {
            $('#linhaErro').show();
            $('#erro').text("Ocorreu um erro ao obter previsão!");
        }
    });

    //
    //WebService -> Forecast - Previsão 15 dias.
    //
    $.ajax({
        url: 'https://apiadvisor.climatempo.com.br/api/v1/forecast/locale/3477/days/15?token=' + token,
        dataType: 'json',
        success: function (dados) {
            //console.log(dados)
            //Loop JSON para atualizar pagina
            $.each(dados, function (dado, valor) {
                // Dados do dia corrente
                if (dado == 'data') {
                    //console.log(dado)
                    for (let i = 0; i < 7; i++) {
                        //dados dia atual
                        if (i == 0) {
                            //Limpar tabela Previsão 5 Dias
                            $('#tabelaPrevisao5Dias').empty();
                            //
                            $.each(dados.data[i], function (dado1, valor1) {
                                //console.log('dados: ' + dado1)
                                //console.log('valor: ' + valor1)
                                //Chuva
                                if (dado1 == 'rain') {
                                    $('#' + dado1 + 'Momento').text(valor1.probability + '% / ' + valor1.precipitation + 'mm');
                                }
                                //Temperatura
                                else if (dado1 == 'thermal_sensation') {
                                    $('#sensation').html(valor1.min + '&deg;C / ' + valor1.max + '&deg;C');
                                }
                                //Temperatura
                                else if (dado1 == 'temperature') {
                                    $('#' + dado1 + 'MinMax').html(valor1.min + '&deg;C / ' + valor1.max + '&deg;C');
                                }
                                //Movimento do Dia
                                else if (dado1 == 'text_icon') {
                                    //Icones
                                    $('#imgMomentoMadrugada').attr('src', caminhoImgPeq + valor1.icon.dawn + '.png');
                                    $('#imgMomentoManha').attr('src', caminhoImgPeq + valor1.icon.morning + '.png');
                                    $('#imgMomentoTarde').attr('src', caminhoImgPeq + valor1.icon.afternoon + '.png');
                                    $('#imgMomentoNoite').attr('src', caminhoImgPeq + valor1.icon.night + '.png');
                                    //Frases
                                    $('#phrase-dawn').text(valor1.text.phrase.dawn);
                                    $('#phrase-morning').text(valor1.text.phrase.morning);
                                    $('#phrase-afternoon').text(valor1.text.phrase.afternoon);
                                    $('#phrase-night').text(valor1.text.phrase.night);
                                    //Frase completa
                                    $('#phrase-reduced').text(valor1.text.phrase.reduced);
                                }
                            });
                        }
                        else {
                            //Dados previsão 5 dias
                            fncPrevisao5Dias(dados.data[i]);
                        }
                    }
                }
            });
        },
        error: function (xhr, status, error) {
            $('#linhaErro').show();
            $('#erro').text("Ocorreu um erro ao obter previsão!");
        }
    });
}
*/
function fncPrevisao5Dias(dados) {
    let data, manha, tarde, noite, chuva, temperatura;

    //Pegar valores do JSON
    $.each(dados, function (dado, valor) {
        //Data
        if (dado == 'date_br') {
            data = '<td><p>' + valor.substr(0, 5) + '</p></td>'
        }
        //Chuva
        else if (dado == 'rain') {
            chuva = '<td><p>' + valor.probability + '% / ' + valor.precipitation + 'mm' + '</p></td>'
        }
        //Temperatura
        else if (dado == 'temperature') {
            temperatura = '<td><p>' + valor.min + '&deg;C / ' + valor.max + '&deg;C' + '</p></td>'
        }
        //Movimento do Dia
        else if (dado == 'text_icon') {
            //Icones
            manha = '<td><img class="icon-day" src="' + caminhoImgPeq + valor.icon.morning + '.png" alt="Imagem">\
                        <p>'+ valor.text.phrase.morning + '</p></td>'
            tarde = '<td><img class="icon-day" src="' + caminhoImgPeq + valor.icon.afternoon + '.png" alt="Imagem">\
                        <p>'+ valor.text.phrase.afternoon + '</p></td>'
            noite = '<td><img class="icon-day" src="' + caminhoImgPeq + valor.icon.night + '.png" alt="Imagem">\
                        <p>'+ valor.text.phrase.night + '</p></td>'
        }
    });

    //Inserir linhas na tabela
    $('#tabelaPrevisao5Dias').append('<tr>' + data + manha + tarde + noite + chuva + temperatura + '</tr>');
}





