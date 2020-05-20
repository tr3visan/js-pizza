let cart = []
let modalQt = 1
let modalKey = 0

const c = el => document.querySelector(el)
const cs = el => document.querySelectorAll(el)

let precoPizza

// Listangem das pizzas 
pizzaJson.map((item, index) => {
  // criando uma cópia do html
  let pizzaItem = c('.models .pizza-item').cloneNode(true)

  pizzaItem.setAttribute('data-key', index)

  // criando referencia e exibindo as info
  pizzaItem.querySelector('.pizza-item--img img').src = item.img
  pizzaItem.querySelector('.pizza-item--price').innerHTML = `R\$${item.price.toFixed(2)}`
  pizzaItem.querySelector('.pizza-item--name').innerHTML = item.name
  pizzaItem.querySelector('.pizza-item--desc').innerHTML = item.description
  
  // Funcão de click à pizza
  pizzaItem.querySelector('a').addEventListener('click', (e) => {
    e.preventDefault()
    modalQt = 1;
    
    // pegando o elemento clicado
    let key = e.target.closest('.pizza-item').getAttribute('data-key')
    modalKey = key

    // enviando infos pro Modal 
    c('.pizzaBig img').src = pizzaJson[key].img
    c('.pizzaInfo h1').innerHTML = pizzaJson[key].name
    c('.pizzaInfo--desc').innerHTML = pizzaJson[key].description
    precoPizza = pizzaJson[key].price.toFixed(2)
    c('.pizzaInfo--actualPrice').innerHTML = `R\$${precoPizza}`

    // removendo o size selecionado
    c('.pizzaInfo--size.selected').classList.remove('selected')

    cs('.pizzaInfo--size').forEach((size, sizeIndex) => {
      sizeIndex === 2 && size.classList.add('selected')
      let sizePizza = pizzaJson[key].sizes[sizeIndex]
      size.querySelector('span').innerHTML = sizePizza
    })

    // qtd de pizzas no modal
    c('.pizzaInfo--qt').innerHTML = modalQt

    // exibindo o modal
    c('.pizzaWindowArea').style.opacity = 0
    c('.pizzaWindowArea').style.display = 'flex'
    setTimeout(() => {
      c('.pizzaWindowArea').style.opacity = 1
    }, 200)
  })

  // inserindo no html
  c('.pizza-area').append(pizzaItem)
})


// Eventos do MODAL
function closeModal() {
  c('.pizzaWindowArea').style.opacity = 0
  setTimeout(() => {
    c('.pizzaWindowArea').style.display = 'none'
  }, 200)
}

cs('.pizzaInfo--cancelButton', 'pizzaInfo--cancelMobileButton')
  .forEach(item => item.addEventListener('click', closeModal))



// pizzaInfo--qtmenos pizzaInfo--qtmais
c('.pizzaInfo--qtmais').addEventListener('click', () => {
  modalQt++
  c('.pizzaInfo--qt').innerHTML = modalQt
  let total = parseFloat(precoPizza) + parseFloat(precoPizza)
  c('.pizzaInfo--actualPrice').innerHTML = `R\$${total}`
})

c('.pizzaInfo--qtmenos').addEventListener('click', () => {
  if(modalQt > 1){
    modalQt--
    c('.pizzaInfo--qt').innerHTML = modalQt
  }
})



// função de click nos tamanhos
cs('.pizzaInfo--size').forEach((size) => {
  size.addEventListener('click', (e)=> {
    c('.pizzaInfo--size.selected').classList.remove('selected')
    size.classList.add('selected')
  })
})



// add carrinho
c('.pizzaInfo--addButton').addEventListener('click', () => {

  let size = parseInt(c('.pizzaInfo--size.selected').getAttribute('data-key'))
  let identifier = `${pizzaJson[modalKey].id}@${size}`
  let key = cart.findIndex((item) => item.identifier === identifier)

  if(key > -1) {
    cart[key].qt += modalQt
  } else {
    cart.push({
      identifier,
      id: pizzaJson[modalKey].id,
      size,
      qt: modalQt
    })
  }

  updateCart()
  closeModal()

})


c('.menu-openner').addEventListener('click', () => {
  if(cart.length > 0) {
    c('aside').style.left = '0'
  }
})

c('.pizzaInfo--cancelMobileButton').addEventListener('click', () => {
  closeModal()
})

c('.menu-closer').addEventListener('click', () => {
  c('aside').style.left = '100vw'
})


// update cart
function updateCart(){

  // carrinho mobile
  let carrinho = c('.menu-openner span')
  carrinho.innerHTML = cart.length


  if(cart.length > 0) {

    c('aside').classList.add('show')
    c('.cart').innerHTML = ''

    let subtotal = 0
    let desconto = 0
    let total = 0

    for(let i in cart){
      let pizzaItem = pizzaJson.find(item => item.id === cart[i].id)
      let cartItem = c('.models .cart--item').cloneNode(true)
      subtotal += pizzaItem.price * cart[i].qt

      let pizzaSizeName
      switch (cart[i].size) {
        case 0:
          pizzaSizeName = 'P'
          break;
        case 1:
          pizzaSizeName = 'M'
          break;
        case 2:
          pizzaSizeName = 'G'
          break;
        default:
          break;
      }
      let pizzaName = `${pizzaItem.name} (${pizzaSizeName})`

      cartItem.querySelector('img').src = pizzaItem.img
      cartItem.querySelector('.cart--item-nome').innerHTML = pizzaName
      cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

      // btn add || remove
      cartItem.querySelector('.cart--item-qtmais').addEventListener('click', ()=>{
        cart[i].qt++
        updateCart()
      })
      cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', ()=>{
        if(cart[i].qt > 1) {
          cart[i].qt--
        } else {
          let option = window.confirm(`Deseja remover ${pizzaName} do carrinho?`)
          option && cart.splice(i, 1) 
        }
        updateCart()
      })


      c('.cart').append(cartItem)
    }

    desconto = subtotal * 0.1
    total = subtotal - desconto

    c('.subtotal span:last-child').innerHTML = `R\$${subtotal.toFixed(2)}`
    c('.desconto span:last-child').innerHTML = `R\$${desconto.toFixed(2)}`
    c('.total span:last-child').innerHTML = `R\$${total.toFixed(2)}`


  } else {

    c('aside').classList.remove('show')
    c('aside').style.left = '100vw'

  }
}

