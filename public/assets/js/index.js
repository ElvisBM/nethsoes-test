var request = new XMLHttpRequest();
request.open('GET', 'data/products.json', true);

request.onload = function() {
	if (request.status >= 200 && request.status < 400) {
	    var data = JSON.parse(request.responseText);
	    products(data);
	}	
};

request.send();

function products(data){

	var boxContent = document.getElementById('content');
    var content = "";

    for (var i = 0; i < data.products.length; i++) {

    	var title = data.products[i].title; 
    	var img = removerAcentos(title);
    	var style = data.products[i].style;
    	var description = data.products[i].description;
    	var installments = data.products[i].installments;
    	var price = data.products[i].price;
    	var currencyFormat = data.products[i].currencyFormat;
    	var availableSizes = data.products[i].availableSizes;
    	
    	availableSizes = availableSizes.toString();
    	installmentsCount =  ( price / installments ).toFixed(2).replace(".",",");
    	price = price.toFixed(2).toString();
    	price = price.split(".");
    	priceHtml = "<strong>"+price[0]+"</strong>,"+price[1];

		content += '<div class="produto col-4">';
		content += '<img src="img/'+ img +'.jpg"> ';
		content += '<p class="title">' + title + '</p>';
		content += '<p class="description">' + style + "<br >" + description +'</p>';
		content += '<p class="availableSizes">' + availableSizes +'</p>';//tamanhos
		content += '<p class="price">'+ currencyFormat + " " +  priceHtml + '</p>';
		content += '<p class="installments"> ou ' + installments + " x <strong> R$" + installmentsCount + '</strong></p>';//pegar valor e dividir por installments
		content += '</div>';
	};

	boxContent.innerHTML = content;

	addProductCart();
}

function addProductCart(){
	var produto = document.querySelectorAll('.produto');
	for (var i = 0; i <  produto.length; i++) {
		produto[i].addEventListener("click", verifyProductCart, false);
	}
}

function verifyProductCart(){

	var product = document.querySelectorAll('.product');
	var titleProduct = this.getElementsByClassName('title');
	titleProduct = titleProduct[0].innerText;
	var position = "";

	for(var i=0;i<product.length;i++){
		var titleCart = product[i].getElementsByClassName('title'); 
		titleCart = titleCart[0].innerText;

		if( titleCart === titleProduct ){
			position = i;
		}
	}

	if( position === "" ){
		productCart( this );
	}else{

		var qtdProduct = product[position].getElementsByClassName('qtd');
		var valueProductCart = product[position].getElementsByClassName('price');
		var qtd = qtdProduct[0].innerText;
		var price = this.getElementsByClassName('price');
		
		qtd = Number(qtd) + 1;
		qtdProduct[0].innerText = qtd;

		price = price[0].innerText;
		price = price.replace("R$","").replace(",",".");
		
		priceCount = (Number(price) * qtd).toFixed(2).replace(".",",");
		priceCount = priceCount.split(",");
		priceHtml = "R$ <strong>"+priceCount[0]+"</strong>,"+priceCount[1];
		valueProductCart[0].innerHTML = priceHtml;

    	//Add Value Cart
    	price = price.split(".");
    	valueCart( "add", price );

    	//Add Qtd Product Cart
    	qtdProductCart("add");
	}

 	//Message Product Add Cart
	message();
}

function productCart( product ){

	var boxContent = document.getElementById('products');

	var title =  product.getElementsByClassName('title');
	var description =  product.getElementsByClassName('description');
	var availableSizes =  product.getElementsByClassName('availableSizes');
	var price =  product.getElementsByClassName('price');
	
	title = title[0].innerText;
	img = removerAcentos(title);
	price = price[0].innerText;
	description = description[0].innerText;
	price = price.replace("R$","").split(",");
	priceHtml = "<strong>"+price[0]+"</strong>,"+price[1];

	var content = "";
	content += '<div class="product clear">';
    content += '<span class="remove">x</span>';
    content += '<div class="content">';
    content += '<img src="img/'+img+'_thumb.jpg" class="thumb">';
    content += '<h4 class="title">'+title+'</h4>';
    content += '<p class="infos">';
    content += description + '<br>';
    content += 'Quantidade: <span class="qtd">1</span>';//Verificar se já existe
    content += '</p>';
    content += '<p class="price">R$ '+priceHtml+'</p>';
    content += '</div>';
    content += '</div>';

  	//addCart
    boxContent.innerHTML += content;

    //Add Qtd Product Cart;
    qtdProductCart( "add" );

    //Add Value Cart
    valueCart( "add", price );

    //Add Click Remove
    addClickRemove();
}

function qtdProductCart( e ){
	
	var countCart = document.getElementById('countCart');
	count = countCart.innerText;
	
	if( e === "add" ){
		var count = Number(count) + 1;
	}

	if( e === "remove" ){
		var count = Number(count) - 1;
	}
	
	countCart.innerText = count;

	return count;
}

function valueCart( e, v ){
	var valueCart = document.getElementById('valueCart');
	var installmentsCart = document.getElementById('installmentCart');
	valueC = Number( valueCart.innerText.replace(",",".").replace("R$","") );

	var value =  Number(v[0] + "." + v[1]);
	var count = "";

	if( e === "add" ){
		count = (value + valueC).toFixed(2);
	}

	if( e === "remove" ){
		count = (valueC - value).toFixed(2);
	}
	
	valueCart.innerHTML = "R$ <strong>" + count.replace(".","</strong>,");

	var installments = (count / 10).toFixed(2);
	installmentsCart.innerHTML =  installments.replace(".",",");
}

function addClickRemove(){
	var remove = document.querySelectorAll('.remove');
	for(var i=0;i<remove.length;i++){
		remove[i].addEventListener('click',removeProductCart,false);
	}
}

function removeProductCart(){

	var product = this.parentNode;
	var price = product.getElementsByClassName('price');
	var priceNew = price[0].innerText;
	var priceCount = price[0].innerText;
	var qtd = product.getElementsByClassName('qtd');
	var count = qtd[0].innerText;
	
	priceCount = priceCount.replace("R$","").replace(",", ".");
	priceNew   = priceNew.replace("R$","").replace(",", ".");
	
	priceCount = Number(priceCount) /  count;
	priceNew   = (Number(priceNew) - Number(priceCount)).toFixed(2);

	priceCount = (priceCount).toString().split(".");
	priceNew   = (priceNew).toString().split(".");

	if( count === "1" ){
		this.parentElement.remove();
	}else{
		qtd[0].innerText = Number(count) - 1;
		price[0].innerHTML = "<strong>"+priceNew [0]+"</strong>,"+priceNew [1];
	}

	qtdProductCart( "remove" );

    valueCart( "remove", priceCount );
}

function message(){
	var message = document.getElementById('message');
	message.style.opacity = "1";

	setTimeout(function(){ message.style.opacity = "0"; }, 1000);
}

window.onload=function(){

	var cartView = document.getElementById('carrinhoClick');
	cartView.addEventListener("click", carrinhoClick, false);

	function carrinhoClick() {
	    var cart = document.getElementById('cart');
	    if ( cart.style.right == "-100%" || cart.style.right == "" ){
	    	cart.style.right  = "0px";
	    }else{
	    	cart.style.right  = "-100%";
	    }
	}
};

//Função Utilizada de https://gist.github.com/marioluan/6923123
//Modificada para o teste, adicionada lowerCase, space e /
function removerAcentos( newStringComAcento ) {
  var string = newStringComAcento;
	var mapaAcentosHex 	= {
		a : /[\xE0-\xE6]/g,
		e : /[\xE8-\xEB]/g,
		i : /[\xEC-\xEF]/g,
		o : /[\xF2-\xF6]/g,
		u : /[\xF9-\xFC]/g,
		c : /\xE7/g,
		n : /\xF1/g
	};

	for ( var letra in mapaAcentosHex ) {
		var expressaoRegular = mapaAcentosHex[letra];
		string = string.replace( expressaoRegular, letra );
	}

	string = string.toLowerCase();
	string = string.replace(/ /g, "-");
	string = string.replace("/", "-");

	return string;
}