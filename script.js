//variaveis Globais
let caminhoImgPeq = 'img/realistic/45px/';
let caminhoImgGde = 'img/realistic/128px/';
let endpointWSMomento = 'https://apiadvisor.climatempo.com.br/api/v1/weather/locale/#/current?';
let endpointWS15Dias = 'https://apiadvisor.climatempo.com.br/api/v1/forecast/locale/#/days/15?';
let tokenWS = '&token=724ad8c3f15b9d400ff996a62d058433';

//inicializar
//3477 - São Paulo
$(document).ready(inicializar(3477));

function inicializar(localidade) {
    //obter geolocalização
    //geolocalizacao.obter();
    WsPrevisaoMomento(localidade)
    WsPrevisao15Dias(localidade)
}
//
//WebService -> Forecast - Momento
//
function WsPrevisaoMomento(localidade) {
    $.ajax({
        url: endpointWSMomento.replace('#', localidade) + tokenWS,
        dataType: 'json',
        success: function (dados) {
            fncPreencherPaginaMomento(dados);
        },
        error: function (xhr, status, error) {
            console.log('Ocorreu um erro ao obter previsão Momento!')
        }
    });
}

//
//WebService -> Forecast - Previsão 15 dias.
//
function WsPrevisao15Dias(localidade) {
    $.ajax({
        url: endpointWS15Dias.replace('#', localidade) + tokenWS,
        dataType: 'json',
        success: function (dados) {
            fncPreencherPagina15Dias(dados);
        },
        error: function (xhr, status, error) {
            console.log('Ocorreu um erro ao obter previsão 15 dias!')
        }
    });
}
//
//Previsão Momento
//Preencher os elementos HTML da página utilizando o JSON de retorno do WebService
//
function fncPreencherPaginaMomento(dados) {
    //console.log('dados ' + dados);
    //Previsão dia atual
    $.each(dados, function (dado, valor) {
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
}
//
//Previsão 15 Dias
//Preencher os elementos HTML da página utilizando o JSON de retorno do WebService
//
function fncPreencherPagina15Dias(dados) {
    let data, manha, tarde, noite, chuva, temperatura;
    //console.log('dados ' + dados);
    //Previsão dia atual
    $.each(dados, function (dado, valor) {
        // Dados do dia corrente
        if (dado == 'data') {
            //console.log(dado)
            for (let i = 0; i < 6; i++) {
                //dados dia atual
                if (i == 0) {
                    //Limpar tabela Previsão 5 Dias
                    $('#tabelaPrevisao5Dias').empty();
                    //
                    $.each(dados.data[i], function (dado1, valor1) {
                        //console.log('dados: ' + dado1)
                        //console.log('valor: ' + valor1)
                        //Data do dia attual
                        if (dado1 == 'date_br') {
                            $('#' + dado1).text(valor1);
                        }
                        //Chuva
                        else if (dado1 == 'rain') {
                            $('#' + dado1 + 'Momento').text(valor1.probability + '% / ' + valor1.precipitation + 'mm');
                        }
                        /*
                        //Sensação
                        else if (dado1 == 'thermal_sensation') {
                            $('#sensation').html(valor1.min + '&deg;C / ' + valor1.max + '&deg;C');
                        }
                        */
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
                    $.each(dados.data[i], function (dado, valor) {
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
            }
        }
    });
}

//Objeto para obter geolocalizacao do browser
let geolocalizacao = {
    erro: null,

    obter() {
        // Verifica se o navegador do usuario tem suporte a geolocalizacao
        if (navigator.geolocation) {
            // Se tiver, solicita os dados e atualiza a previsao do tempo pela API
            navigator.geolocation.getCurrentPosition(sucesso, error);
        } else {
            //Seu navegador não suporta geolocalização
            error(999);
        }

        function sucesso(dados) {
            //console.log('dados.coords.latitude ' + dados.coords.latitude)
            //console.log('dados.coords.longitude ' + dados.coords.longitude)
            chamaWsPrevisao(dados.coords);
        };

        function error(error) {
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
            console.log('Erro obter geolocalização: ' + this.erro);
        };
    }
}

//
//Botão localidade
//
$('#btnLocalidade').click(function () {
    inicializar($('#localidade').val());
    window.location.href = '#fechar';
});

//
//Fechar quando clicar fora do modal
//
$('#openModal').click(function (event) {
    if (event.target == this)
        window.location.href = '#fechar';
});

