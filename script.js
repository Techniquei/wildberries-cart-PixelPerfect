const available_products_wrapper = document.querySelector(".available-list")

const missed_products_wrapper = document.querySelector(
  "products-in-card-wrapper.missed"
)

let products = document.querySelectorAll(".product-in-card-wrapper")

let available_products = available_products_wrapper.querySelectorAll(
  ".product-in-card-wrapper"
)

let like_buttons = document.querySelectorAll(".like")

let delete_buttons = document.querySelectorAll(".delete")

let cart__in_stock_checkbox = document.querySelector("#cart__in-stock-checkbox")

let custom_checkboxes_product = available_products_wrapper.querySelectorAll(
  ".custom-checkbox-product"
)

let products_in_card = []

reloadProductInCart()

function reloadProductInCart() {
  products_in_card = []
  available_products = available_products_wrapper.querySelectorAll(
    ".product-in-card-wrapper"
  )
  let total_sum = 0
  let total_old_sum = 0
  let total_discount = 0
  let total_checked = 0

  available_products.forEach((e) => {
    let id = e.getAttribute("data-product-number")
    let name = e.querySelector("h5").innerText
    let price = e.getAttribute("product-price")
    let checked = e.querySelector(".custom-checkbox-product").checked

    let price_old = e.getAttribute("product-price-old")
    let quantity = e.querySelector(".product__counter-wrapper-number").innerText
    let max_quantity = parseInt(
      e.querySelector(".product-in-card-wrapper-right p").innerText.match(/\d+/)
    )
    let total_price = price * quantity
    let total_price_old = price_old * quantity
    products_in_card.push({
      id,
      name,
      price,
      price_old,
      quantity,
      max_quantity,
      checked,
    })
    let total_price_string = numberFormatterToString(total_price)
    let cart__new_price = e.querySelector(".cart__new-price")
    cart__new_price.innerHTML = `${total_price_string} <span>сом</span>`
    total_price_string.length > 4
      ? cart__new_price.classList.add("small")
      : cart__new_price.classList.remove("small")

    let total_price_old_string = numberFormatterToString(total_price_old)
    let cart__old_price = e.querySelector(".cart__old-price")
    cart__old_price.innerHTML = `${total_price_old_string} <span>сом</span>`
    if (checked) {
      total_sum += price * quantity
      total_old_sum += price_old * quantity
      total_discount += (price_old - price) * quantity
      total_checked++
    }

    if (quantity == 1) {
      e.querySelector(".product__counter-wrapper-decrease div").style.color =
        "rgba(0, 0, 0, 0.2)"
    } else {
      e.querySelector(".product__counter-wrapper-decrease div").style.color =
        null
    }
    if (quantity == max_quantity) {
      e.querySelector(".product__counter-wrapper-increase div").style.color =
        "rgba(0, 0, 0, 0.2)"
    } else {
      e.querySelector(".product__counter-wrapper-increase div").style.color =
        null
    }
  })

  let old_total_sum = parceIntFromInnerText("[data-total_sum]")

  let element_total_sum = document.querySelector("[data-total_sum]")

  increaseNumberAnimationStep(old_total_sum, element_total_sum, total_sum)

  let old_old_sum = parceIntFromInnerText("[data-old_sum]")
  let element_old_sum = document.querySelector("[data-old_sum]")
  increaseNumberAnimationStep(old_old_sum, element_old_sum, total_old_sum)

  document.querySelector(
    "[data-old_sum]"
  ).innerText = `${numberFormatterToString(total_old_sum)} сом`

  document.querySelector(
    "[data_total_discount]"
  ).innerText = `-${numberFormatterToString(total_discount)} сом`

  document.querySelector(
    "#cart__in-stock-checkbox-wrapper p"
  ).innerText = `В корзине · ${
    document.querySelector(".products-in-card-wrapper.available-list").children
      .length
  } товара`

  document.querySelector(
    ".missing-product__counter-wrapper p"
  ).innerText = `Отсутствуют · ${
    document.querySelector(".products-in-card-wrapper.missed").children.length
  } товара`

  document.querySelector(
    "[data-count-in-total]"
  ).innerText = `${total_checked} товар(а)`
}

function productQuantityIncreace(id) {
  let product_with_id = products_in_card.find((e) => e.id == id)

  if (product_with_id.quantity != product_with_id.max_quantity) {
    product_with_id.quantity++
    available_products_wrapper.querySelector(
      `[data-product-number="${id}"] .product__counter-wrapper-number`
    ).innerText = product_with_id.quantity
  } else {
  }
  reloadProductInCart()
}

function productQuantityDecrease(id) {
  let product_with_id = products_in_card.find((e) => e.id == id)
  if (product_with_id.quantity > 1) {
    product_with_id.quantity--
    available_products_wrapper.querySelector(
      `[data-product-number="${id}"] .product__counter-wrapper-number`
    ).innerText = product_with_id.quantity
  }
  reloadProductInCart()
}

document.addEventListener("click", (e) => {
  let target = e.target
  if (target.classList.contains("like")) {
    getProductsFromChild(target).forEach((e) => {
      let like = e.querySelector(".like")
      if (like.getAttribute("src") == "./img/like_active.svg") {
        like.setAttribute("src", "./img/like.svg")
      } else {
        like.setAttribute("src", "./img/like_active.svg")
      }
    })
  }

  if (target.classList.contains("delete")) {
    getProductsFromChild(target).forEach((element) => {
      element.remove()
      reloadProductInCart()
    })
    let product_id = target
      .closest(".product-in-card-wrapper")
      .getAttribute("data-product-number")
    document
      .querySelectorAll(`[small-photo-id="${product_id}"]`)
      .forEach((i) => i.remove())
  }

  if (target.classList.contains("expand_button")) {
    let parent_cart_in_stock = target.closest(".cart__in-stock")
    let products_wrapper = parent_cart_in_stock.querySelector(
      ".products-in-card-wrapper"
    )
    products_wrapper.classList.toggle("display-none")
    target.classList.toggle("rotate-180")
    let div = parent_cart_in_stock.querySelector("[data-wrap]")
    div.classList.toggle("display-none")

    let checkbox_data_wrap = document.querySelector(
      "#cart__in-stock-checkbox-wrapper p"
    )
    checkbox_data_wrap.classList.toggle("display-none")
  }

  if (target.classList.contains("product__counter-wrapper-increase")) {
    let product_id = target
      .closest(".product-in-card-wrapper")
      .getAttribute("data-product-number")
    productQuantityIncreace(product_id)
  }

  if (target.classList.contains("product__counter-wrapper-decrease")) {
    let product_id = target
      .closest(".product-in-card-wrapper")
      .getAttribute("data-product-number")
    productQuantityDecrease(product_id)
  }
})

cart__in_stock_checkbox.addEventListener("change", function () {
  if (this.checked) {
    products.forEach((e) => {
      e.querySelector(".custom-checkbox-product").checked = true
      reloadProductInCart()
    })
  } else {
    products.forEach((e) => {
      e.querySelector(".custom-checkbox-product").checked = false
      reloadProductInCart()
    })
  }
})

custom_checkboxes_product.forEach((e) => {
  e.addEventListener("change", () => {
    let check = 0
    custom_checkboxes_product.forEach((i) => {
      if (i.checked == false) check++
    })
    if (check) {
      cart__in_stock_checkbox.checked = false
    } else {
      cart__in_stock_checkbox.checked = true
    }
    reloadProductInCart()
  })
})

function getProductsFromChild(target) {
  let product_id = target
    .closest(".product-in-card-wrapper")
    .getAttribute("data-product-number")
  let products_with_id = document.querySelectorAll(
    `[data-product-number="${product_id}"]`
  )
  return products_with_id
}

function numberFormatterToString(number) {
  return String(number)
    .split("")
    .reverse()
    .map((el, index) => (index % 3 !== 2 ? el : ` ${el}`))
    .reverse()
    .join("")
}

// Inputs
let recipient_name = document.querySelector("#recipient_name")
let recipient_last_name = document.querySelector("#recipient_last-name")
let recipient_mail = document.querySelector("#recipient_mail")
let recipient_phone = document.querySelector("#recipient_phone")
let recipient_inn = document.querySelector("#recipient_inn")
let order_button = document.querySelector(".order-button")

function addRedOnForm(input, bool) {
  if (bool) {
    input.classList.add("color-red")
    input.nextElementSibling.classList.add("color-red")
  } else {
    input.classList.remove("color-red")
    input.nextElementSibling.classList.remove("color-red")
    input.nextElementSibling.innerText = ""
  }
}

function showHideLabel(element) {
  if (element.value.length != 0) {
    element.previousElementSibling.classList.remove("display-none")
  } else {
    element.previousElementSibling.classList.add("display-none")
  }
}

function checkName() {
  if (!recipient_name.value.length) {
    addRedOnForm(recipient_name, true)
    recipient_name.nextElementSibling.innerText = "Укажите имя"
  } else {
    addRedOnForm(recipient_name, false)
  }
}

function checkLastName() {
  if (!recipient_last_name.value.length) {
    addRedOnForm(recipient_last_name, true)
    recipient_last_name.nextElementSibling.innerText = "Введите фамилию"
    return
  }
  addRedOnForm(recipient_last_name, false)
}

function checkMail() {
  const EMAIL_REGEXP =
    /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/iu
  if (!recipient_mail.value.length) {
    addRedOnForm(recipient_mail, true)
    recipient_mail.nextElementSibling.innerText = "Укажите электронную почту"
    return
  }
  if (!EMAIL_REGEXP.test(recipient_mail.value)) {
    addRedOnForm(recipient_mail, true)
    recipient_mail.nextElementSibling.innerText =
      "Проверьте адрес электронной почты"
    return
  }
  addRedOnForm(recipient_mail, false)
}

function checkPhone() {
  const PHONE_REGEXP = /(\+\d)+ +(\d{3})+ +(\d{3})+ +(\d{2})+ +(\d{2})$/
  if (!recipient_phone.value.length) {
    addRedOnForm(recipient_phone, true)
    recipient_phone.nextElementSibling.innerText = "Укажите номер телефона"
    return
  }

  if (!PHONE_REGEXP.test(recipient_phone.value)) {
    addRedOnForm(recipient_phone, true)
    recipient_phone.nextElementSibling.innerText = "Формат: +9 999 999 99 99"
    return
  }
  addRedOnForm(recipient_phone, false)
}

function checkINN() {
  const INN_REGEXP = /[0-9]{5,10}$/
  if (!recipient_inn.value.length) {
    addRedOnForm(recipient_inn, true)
    recipient_inn.nextElementSibling.innerText = "Укажите индекс"
    return
  }
  if (!INN_REGEXP.test(recipient_inn.value)) {
    addRedOnForm(recipient_inn, true)
    recipient_inn.nextElementSibling.innerText = "Формат: 1234567"
    return
  }
  addRedOnForm(recipient_inn, false)
  recipient_inn.nextElementSibling.innerText = "Для таможенного оформления"
}

order_button.addEventListener("click", () => {
  checkName()
  checkLastName()
  checkMail()
  checkPhone()
  checkINN()
})

recipient_name.addEventListener("change", () => {
  checkName()
})
recipient_name.addEventListener("keydown", () => {
  setTimeout(showHideLabel, 10, recipient_name)

  if (recipient_name.classList.contains("color-red")) {
    setTimeout(checkName, 10)
  }
})

recipient_last_name.addEventListener("change", () => {
  checkLastName()
})
recipient_last_name.addEventListener("keydown", () => {
  setTimeout(showHideLabel, 10, recipient_last_name)
  if (recipient_last_name.classList.contains("color-red")) {
    setTimeout(checkLastName, 10)
  }
})

recipient_mail.addEventListener("change", () => {
  checkMail()
})
recipient_mail.addEventListener("keydown", () => {
  setTimeout(showHideLabel, 10, recipient_mail)
  if (recipient_mail.classList.contains("color-red")) {
    setTimeout(checkMail, 10)
  }
})

recipient_phone.addEventListener("change", () => {
  checkPhone()
})
recipient_phone.addEventListener("keydown", () => {
  setTimeout(showHideLabel, 10, recipient_phone)
  if (recipient_phone.classList.contains("color-red")) {
    setTimeout(checkPhone, 10)
  }
})

recipient_phone.addEventListener("focus", () => {
  if (recipient_phone.value.length == 0) {
    recipient_phone.value = "+"
  }
})

recipient_phone.addEventListener("keypress", (e) => {
  if (/[a-zA-Z]|\s/.test(e.key)) {
    e.preventDefault()
  }
  if (recipient_phone.value[0] == "+") {
    if (recipient_phone.value.length == 2) {
      recipient_phone.value += " "
    }
    if (recipient_phone.value.length == 6) {
      recipient_phone.value += " "
    }
    if (recipient_phone.value.length == 10) {
      recipient_phone.value += " "
    }
    if (recipient_phone.value.length == 13) {
      recipient_phone.value += " "
    }
  } else {
    if (recipient_phone.value.length == 1) {
      recipient_phone.value += " "
    }
    if (recipient_phone.value.length == 5) {
      recipient_phone.value += " "
    }
    if (recipient_phone.value.length == 9) {
      recipient_phone.value += " "
    }
    if (recipient_phone.value.length == 12) {
      recipient_phone.value += " "
    }
  }
})

recipient_inn.addEventListener("change", () => {
  checkINN()
})
recipient_inn.addEventListener("keydown", () => {
  setTimeout(showHideLabel, 10, recipient_inn)
  if (recipient_inn.classList.contains("color-red")) {
    setTimeout(checkINN, 10)
  }
})

function increaseNumberAnimationStep(i, element, endNumber) {
  console.log("foo ", i, endNumber)
  if (endNumber - i >= 0) {
    let sub_num = (endNumber - i) / 5
    if (i < endNumber) {
      i = Math.ceil(i + sub_num)
      element.innerText = numberFormatterToString(i) + " сом"
      setTimeout(function () {
        increaseNumberAnimationStep(i, element, endNumber)
      }, 10)
    }
  } else {
    let sub_num = (i - endNumber) / 5
    if (i > endNumber) {
      i = Math.floor(i - sub_num)
      element.innerText = numberFormatterToString(i) + " сом"
      setTimeout(function () {
        increaseNumberAnimationStep(i, element, endNumber)
      }, 10)
    }
  }
}

function parceIntFromInnerText(tag) {
  return parseInt(document.querySelector(tag).innerText.match(/\d+/))
}
