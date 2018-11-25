//variaveis Globais
let caminhoImgPeq = 'img/realistic/45px/';
let caminhoImgGde = 'img/realistic/128px/';
let endpointWSMomento = 'https://apiadvisor.climatempo.com.br/api/v1/weather/locale/#/current?';
let endpointWS15Dias = 'https://apiadvisor.climatempo.com.br/api/v1/forecast/locale/#/days/15?';
let tokenWS = '&token=724ad8c3f15b9d400ff996a62d058433';

//inicializar

$(document).ready(inicializar());

function inicializar() {
    let vLocalidade;
    //obter geolocalização
    //geolocalizacao.obter();

    //Pegar localidade
    vLocalidade = obterLocalidade();

    //Preencher Select localidades
    preencheLocalidades(vLocalidade);

    //Chamar webservice e atualizar pagina
    WsPrevisaoMomento(vLocalidade)

    //Chamar webservice e atualizar pagina
    WsPrevisao15Dias(vLocalidade)
}

//
//Memorizar Localidade
//
function memorizarLocalidade(loc) {
    if (typeof (localStorage) !== "undefined") {
        localStorage.localidade = loc;
    }
}

//
//Memorizar Localidade
//
function obterLocalidade() {
    if (typeof (localStorage.localidade) != 'undefined') {
        return localStorage.localidade;
    }
    else {
        //3477 - São Paulo        
        return 3477;
    }
}

//função para aplicar fundos background
function aplicarFundo(chave) {
    switch (chave) {
        case '1':
        case '2':
        case '2r':
        case '4':
            $('body').css('background-image', "url('img/fundo/fundo_calor_dia.jpg')");
            break;
        case '1n':
        case '2n':
        case '2rn':
            $('body').css('background-image', "url('img/fundo/fundo_calor_noite.jpg')");
            break;
        case '3':
        case '4':
        case '4r':
        case '4t':
        case '5':
            $('body').css('background-image', "url('img/fundo/fundo_chuva_dia.jpg')");
            break;
        case '3n':
        case '3TM':
        case '4n':
        case '4rn':
        case '4tn':
        case '5n':
        case '6':
        case '6n':
            $('body').css('background-image', "url('img/fundo/fundo_chuva_noite.jpg')");
            break;
        case '7':
        case '8':
        case '9':
            $('body').css('background-image', "url('img/fundo/fundo_frio_dia.jpg')");
            break;
        case '7n':
        case '8n':
        case '9n':
            $('body').css('background-image', "url('img/fundo/fundo_frio_noite.jpg')");
            break;
        default:
            $('body').css('background-image', "url('img/fundo/fundo.jpg')");
            break;
    }
}

//
// Preencher Select das localidades
//
function preencheLocalidades(locPadrao) {
    //let localidades = [{cod:4502, desc: 'Aracaju - SE'}];
    let options
    let localidades =
        [
            { 'cod': 4502, 'desc': 'Aracaju - SE' },
            { 'cod': 7704, 'desc': 'Belém - PA' },
            { 'cod': 6879, 'desc': 'Belo Horizonte - MG' },
            { 'cod': 5775, 'desc': 'Boa Vista - RR' },
            { 'cod': 8173, 'desc': 'Brasília - DF' },
            { 'cod': 6760, 'desc': 'Campo Grande - MS' },
            { 'cod': 7615, 'desc': 'Cuiabá - MT' },
            { 'cod': 6731, 'desc': 'Curitiba - PR' },
            { 'cod': 4915, 'desc': 'Florianópolis - SC' },
            { 'cod': 8050, 'desc': 'Fortaleza - CE' },
            { 'cod': 6861, 'desc': 'Goiânia - GO' },
            { 'cod': 7364, 'desc': 'João Pessoa - PB' },
            { 'cod': 3982, 'desc': 'Macapá - AP' },
            { 'cod': 6809, 'desc': 'Maceió - AL' },
            { 'cod': 7544, 'desc': 'Manaus - AM' },
            { 'cod': 5864, 'desc': 'Natal - RN' },
            { 'cod': 3427, 'desc': 'Palmas - TO' },
            { 'cod': 5346, 'desc': 'Porto Alegre - RS' },
            { 'cod': 5757, 'desc': 'Porto Velho - RO' },
            { 'cod': 7140, 'desc': 'Recife - PE' },
            { 'cod': 7717, 'desc': 'Rio Branco - AC' },
            { 'cod': 5959, 'desc': 'Rio de Janeiro - RJ' },
            { 'cod': 7564, 'desc': 'Salvador - BA' },
            { 'cod': 6867, 'desc': 'São Luís - MA' },
            { 'cod': 3477, 'desc': 'São Paulo - SP' },
            { 'cod': 6951, 'desc': 'Teresina - PI' },
            { 'cod': 8284, 'desc': 'Vitória - ES' }
        ];
    //Limpar select
    $('#localidade').empty();

    //criar options
    localidades.forEach((dado) => {
        if (dado.cod == locPadrao) {
            options += '<option value="' + dado.cod + '" selected="selected">' + dado.desc + '</option>';
        }
        else {
            options += '<option value="' + dado.cod + '">' + dado.desc + '</option>';
        }
    })

    //Inserir linhas
    $('#localidade').append(options);
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
            fncErro('Ocorreu um erro ao obter previsão Momento: ' + error)
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
            fncErro('Ocorreu um erro ao obter previsão 15 dias: ' + error)
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
    try {
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
                        //Imagem de fundo
                        aplicarFundo(valor1)
                    }
                });
            }
        });
    } catch (error) {
        fncErro('Ocorreu erro preencher pagina Momento: ' + error)
    }
}
//
//Previsão 15 Dias
//Preencher os elementos HTML da página utilizando o JSON de retorno do WebService
//
function fncPreencherPagina15Dias(dados) {
    let semana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    let diaInteiro, chuva, temperatura;
    //console.log('dados ' + dados);
    //Previsão dia atual
    try {
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
                                let arr = valor.split("/").reverse();
                                //Ano, Mês, Dia, Hora, Minuto, Segundo
                                //meses em JavaScript começam em 0. Ou seja janeiro é o mês 0
                                let dt = new Date(arr[0], arr[1] - 1, arr[2]);
                                data = '<td><p>' + semana[dt.getDay()] + '</p>'
                                data += '<p>' + valor.substr(0, 5) + '</p></td>'
                            }
                            //Chuva
                            else if (dado == 'rain') {
                                chuva = '<td><p>' + valor.probability + '%' + '</p></td>'
                                chuva += '<td><p>' + valor.precipitation + 'mm' + '</p></td>'
                            }
                            //Temperatura
                            else if (dado == 'temperature') {
                                temperatura = '<td><p>' + valor.min + '&deg;C' + '</p></td>'
                                temperatura += '<td><p>' + valor.max + '&deg;C' + '</p></td>'
                            }
                            //Movimento do Dia
                            else if (dado == 'text_icon') {
                                //Icones
                                diaInteiro = '<td><img class="icon-day" src="' + caminhoImgPeq + valor.icon.day + '.png" alt="Imagem">\
                                             <p>'+ valor.text.pt + '</p></td>'
                            }
                        });
                        //Inserir linhas na tabela
                        $('#tabelaPrevisao5Dias').append('<tr>' + data + diaInteiro + chuva + temperatura + '</tr>');
                    }
                }
            }
        });
    } catch (error) {
        fncErro('Ocorreu erro preencher pagina 5 Dias: ' + error)
    }
}

//
//Botão localidade
//
$('#btnLocalidade').click(function () {
    localStorage.localidade = $('#localidade').val();
    inicializar();
    window.location.href = '#fechar';
});

//
//Fechar quando clicar fora do modal
//
$('#openModal').click(function (event) {
    if (event.target == this)
        window.location.href = '#fechar';
});

//
//Função para mostar erro na tela
//
function fncErro(erro) {
    $("#erro>p").text(erro);
    $("#erro").show();
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
