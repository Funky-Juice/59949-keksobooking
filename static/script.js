"use strict";
! function() {
  var o, t = 1e4,
    n = 5e4,
    r = {
      middle: function(e) {
        return t < e && e < n
      },
      low: function(e) {
        return e <= t
      },
      high: function(e) {
        return n <= e
      }
    },
    i = {
      "housing-type": function(e) {
        return f(e, "type", c.value)
      },
      "housing-price": function(e) {
        return r[u.value](e.offer.price)
      },
      "housing-rooms": function(e) {
        return f(e, "rooms", d.value)
      },
      "housing-guests": function(e) {
        return f(e, "guests", l.value)
      }
    },
    a = document.querySelector(".map__filters"),
    c = a.querySelector("#housing-type"),
    u = a.querySelector("#housing-price"),
    d = a.querySelector("#housing-rooms"),
    l = a.querySelector("#housing-guests"),
    s = Array.prototype.slice.call(a.querySelectorAll("select")),
    f = function(e, t, n) {
      return e.offer[t].toString() === n
    },
    p = function(t) {
      return o.every(function(e) {
        return -1 !== t.offer.features.indexOf(e.value)
      })
    };
  window.filter = {
    element: a,
    apply: function(e) {
      var t = e.slice(),
        n = s.filter(function(e) {
          return "any" !== e.value
        });
      return o = Array.prototype.slice.call(a.querySelectorAll('input[type="checkbox"]:checked')), n.forEach(function(e) {
        t = t.filter(i[e.id])
      }), t = t.filter(p)
    },
    reset: function() {
      a.reset()
    }
  }
}(),
  function() {
    var e = ["gif", "jpg", "jpeg", "png", "JPG", "JPEG", "PNG"],
      n = ["dragover", "dragleave", "drop"],
      t = document.querySelectorAll(".upload input[type=file]"),
      o = document.querySelector(".notice__preview"),
      r = document.querySelector(".form__photo-container .upload__preview"),
      i = document.querySelectorAll(".drop-zone"),
      c = null,
      u = null,
      d = {
        avatar: function(e) {
          l(e[0], o, !0)
        },
        images: function(e) {
          Array.prototype.forEach.call(e, function(i) {
            for (; r.firstChild;) r.removeChild(r.firstChild);
            e.length <= 3 ? l(i, r) : window.showAlert("Превышено максимальное количество фотографий: 3", "error")
          })
        }
      },
      l = function(e, n, o) {
        if (e && s(e.name)) {
          var r = new FileReader;
          r.addEventListener("load", function() {
            var e = document.createElement("img");
            if (e.classList.add("upload__img"), e.src = r.result, e.draggable = !0, f(e), e.addEventListener("dragstart", g), e.addEventListener("dragend", y), e.addEventListener("drop", h), n.appendChild(e), o) {
              var t = n.removeChild(n.children[0]);
              t.src.endsWith("img/muffin.png") && (u = t)
            }
          }), r.readAsDataURL(e)
        } else window.showAlert("Неверный формат изображения", "error")
      },
      s = function(t) {
        return e.some(function(e) {
          return t.endsWith(e)
        })
      },
      f = function(t) {
        n.forEach(function(e) {
          t.addEventListener(e, function(e) {
            e.preventDefault(), e.stopPropagation()
          })
        })
      },
      p = function(e) {
        var t = e.target.files;
        d[e.target.id](t)
      },
      m = function(e) {
        e.target.classList.add("drop-zone--dragover")
      },
      v = function(e) {
        e.target.classList.remove("drop-zone--dragover")
      },
      w = function(e) {
        e.target.classList.remove("drop-zone--dragover");
        var t = e.dataTransfer.files;
        d[e.target.htmlFor](t)
      },
      g = function(e) {
        e.target.classList.add("upload__img--placeholder"), e.dataTransfer.setDragImage(e.target, 20, 20), e.dataTransfer.dropEffect = "move", c = e.target
      },
      y = function(e) {
        e.target.classList.remove("upload__img--placeholder")
      },
      h = function(e) {
        var t = e.target,
          n = t.getBoundingClientRect().left + (t.getBoundingClientRect().right - t.getBoundingClientRect().left) / 2;
        e.clientX > n ? t.nextSibling ? t.parentElement.insertBefore(c, t.nextSibling) : t.parentElement.appendChild(c) : t.parentElement.insertBefore(c, t), c = null
      };
    i.forEach(function(e) {
      f(e), e.addEventListener("dragover", m), e.addEventListener("dragleave", v), e.addEventListener("drop", w)
    }), t.forEach(function(e) {
      e.addEventListener("change", p)
    }), window.uploadPhoto = {
      clear: function() {
        for (; r.firstChild;) r.removeChild(r.firstChild);
        u && (o.removeChild(o.children[0]), o.appendChild(u))
      }
    }
  }(),
  function() {
    var n, o = null;
    window.showAlert = function(e, t) {
      o && (document.body.removeChild(o), clearTimeout(n), o = null), (o = document.createElement("p")).classList.add("alert-box", "alert-box--" + t), o.textContent = e, document.body.appendChild(o), n = setTimeout(function() {
        document.body.removeChild(o), o = null, clearTimeout(n)
      }, 4e3)
    }
  }(),
  function() {
    var o = 200,
      r = {
        SEND_FORM: window.SERVER_URL_POST,
        GET_DATA: window.SERVER_URL_GET
      },
      i = {
        singular: "секунду",
        few: "секунды",
        many: "секунд"
      },
      a = function(e, t) {
        var n = new XMLHttpRequest;
        return n.timeout = 15e3, n.responseType = "json", n.addEventListener("load", function() {
          n.status === o ? e(n.response) : t()
        }), n.addEventListener("error", function() {
          t("Произошла ошибка соединения.")
        }), n.addEventListener("timeout", function() {
          t("Запрос не успел выполниться за  " + window.utils.declensionOfNoun(Math.ceil(n.timeout / 1e3), i) + ".")
        }), n
      };
    window.backend = {
      upload: function(e, t, n) {
        var o = a(t, n);
        o.open("POST", r.SEND_FORM), o.send(e)
      },
      download: function(e, t) {
        var n = a(e, t);
        n.open("GET", r.GET_DATA), n.send()
      }
    }
  }(),
  function() {
    var t, n = 500;
    window.utils = {
      declensionOfNoun: function(e, t) {
        return 5 < e && e < 21 ? e + " " + t.many : e % 10 == 1 ? e + " " + t.singular : e % 10 < 5 && 0 < e % 10 ? e + " " + t.few : e + " " + t.many
      },
      syncSelects: function(e, t, n) {
        "function" == typeof n ? n() : t.value = e.value
      },
      syncInputToSelect: function(e, t, n, o) {
        t[o] = n[e.value]
      },
      toggleFormFieldsState: function(e, t) {
        Array.prototype.forEach.call(e, function(e) {
          e.disabled = t
        })
      },
      debounce: function(e) {
        t && clearTimeout(t), t = window.setTimeout(e, n)
      }
    }
  }(),
  function() {
    var o = 70,
      r = [],
      i = function(t) {
        r.forEach(function(e) {
          t.removeChild(e)
        }), r = []
      };
    window.pins = {
      add: function(e, t) {
        var n = document.createDocumentFragment();
        r && i(t), (e = e.length < 5 ? e : e.slice(0, 5)).forEach(function(e) {
          var t = function(t) {
            var e = document.querySelector("template").content.querySelector(".map__pin").cloneNode(!0).cloneNode(!0);
            e.style.left = t.location.x + "px", e.style.top = t.location.y - o / 2 + "px";
            var n = t.author;
            return e.querySelector("img").src = n.avatar || "img/avatars/default.png", e.addEventListener("click", function() {
              var e = window.card.create(t);
              window.card.open(e)
            }), e
          }(e);
          r.push(t), n.appendChild(t)
        }), t.appendChild(n)
      },
      remove: i
    }
  }(),
  function() {
    var t, n = 27,
      a = {
        flat: "Квартира",
        house: "Дом",
        bungalo: "Бунгало",
        palace: "Дворец"
      },
      c = {
        singular: "комната",
        few: "комнаты",
        many: "комнат"
      },
      u = {
        singular: "гостя",
        few: "гостей",
        many: "гостей"
      },
      d = function() {
        t && (window.map.element.removeChild(t), t = null, document.removeEventListener("keydown", o))
      },
      l = function(e) {
        var t = document.createElement("li");
        return t.classList.add("feature", "feature--" + e), t
      },
      s = function(e) {
        var t = document.createElement("li"),
          n = document.createElement("img");
        return n.width = 70, n.src = e, t.appendChild(n), t
      },
      o = function(e) {
        e.keyCode === n && d()
      };
    window.card = {
      create: function(e) {
        var t = document.querySelector("template").content.querySelector(".popup").cloneNode(!0),
          n = t.querySelector(".popup__close"),
          o = t.querySelector(".popup__features"),
          r = t.querySelector(".popup__pictures");
        t.querySelector("h3").textContent = e.offer.title, t.querySelector("small").textContent = e.offer.address, t.querySelector(".popup__price").innerHTML = e.offer.price + " &#x20bd;/ночь", t.querySelector("h4").textContent = a[e.offer.type], t.querySelector(".popup__size").textContent = window.utils.declensionOfNoun(e.offer.rooms, c) + " для " + window.utils.declensionOfNoun(e.offer.guests, u), t.querySelector(".popup__time").textContent = "Заезд после " + e.offer.checkin + " , выезд до " + e.offer.checkout, t.querySelector(".popup__description").textContent = e.offer.description;
        var i = e.author;
        return t.querySelector(".popup__avatar").src = i.avatar || "img/avatars/default.png", e.offer.features.forEach(function(e) {
          o.appendChild(l(e))
        }), e.offer.photos ? e.offer.photos.forEach(function(e) {
          r.appendChild(s(e))
        }) : null, n.addEventListener("click", function() {
          d()
        }), t
      },
      open: function(e) {
        t && d(), t = e, window.map.element.appendChild(t), document.addEventListener("keydown", o)
      },
      close: d
    }
  }(),
  function() {
    var t = document.querySelector(".notice__form"),
      e = t.querySelectorAll("fieldset"),
      n = t.querySelectorAll(".form__element input"),
      o = t.querySelector(".form__reset"),
      r = t.querySelector("#address"),
      i = t.querySelector("#type"),
      a = t.querySelector("#price"),
      c = t.querySelector("#checkin"),
      u = t.querySelector("#checkout"),
      d = t.querySelector("#room_number"),
      l = t.querySelector("#capacity"),
      s = {
        bungalo: 0,
        flat: 1e3,
        house: 5e3,
        palace: 1e4
      },
      f = {
        1: ["1"],
        2: ["1", "2"],
        3: ["1", "2", "3"],
        100: ["0"]
      },
      p = function() {
        t.classList.add("notice__form--disabled"), t.reset(), window.utils.toggleFormFieldsState(e, !0), i.removeEventListener("change", g), c.removeEventListener("change", y), u.removeEventListener("change", h), d.removeEventListener("change", w), o.removeEventListener("click", L), n.forEach(function(e) {
          e.classList.remove("invalid"), e.removeEventListener("keyup", E)
        }), t.removeEventListener("invalid", v, !0)
      },
      m = function() {
        Array.prototype.forEach.call(l.options, function(e) {
          e.disabled = !f[d.value].includes(e.value)
        })
      },
      v = function(e) {
        e.target.classList.add("invalid"), n.forEach(function(e) {
          e.addEventListener("keyup", E)
        })
      },
      w = function() {
        window.utils.syncSelects(d, l, function() {
          l.value = f[d.value][0]
        }), m()
      },
      g = function() {
        window.utils.syncInputToSelect(i, a, s, "min")
      },
      y = function() {
        window.utils.syncSelects(c, u)
      },
      h = function() {
        window.utils.syncSelects(u, c)
      },
      E = function(e) {
        e.target.checkValidity() && e.target.classList.remove("invalid")
      },
      L = function(e) {
        e.preventDefault(), p(), window.map.deactivate()
      },
      S = function() {
        window.showAlert("Данные успешно отправлены!", "success"), p(), window.map.deactivate()
      },
      _ = function(e) {
        e ? window.showAlert(e, "error") : window.showAlert("Ошибка сервера. Попробуйте отправить данные позже.", "error")
      };
    t.addEventListener("submit", function(e) {
      window.backend.upload(new FormData(t), S, _), e.preventDefault()
    }), window.utils.toggleFormFieldsState(e, !0), window.form = {
      activate: function() {
        t.classList.remove("notice__form--disabled"), window.utils.toggleFormFieldsState(e, !1), i.addEventListener("change", g), c.addEventListener("change", y), u.addEventListener("change", h), d.addEventListener("change", w), o.addEventListener("click", L), t.addEventListener("invalid", v, !0), window.utils.syncInputToSelect(i, a, s, "min"), window.utils.syncSelects(d, l, function() {
          l.value = f[d.value][0]
        }), m()
      },
      deactivate: p,
      setLocation: function(e, t) {
        r.value = e + ", " + t
      }
    }
  }(),
  function() {
    var c, u = 150,
      d = 500,
      l = 62,
      s = 18,
      f = !1,
      e = document.querySelector(".map"),
      p = e.querySelector(".map__pin--main"),
      m = e.querySelector(".map__pins"),
      v = function() {
        e.classList.remove("map--faded")
      },
      t = function(e) {
        var o = {
            x: e.clientX,
            y: e.clientY
          },
          r = p.offsetTop,
          i = p.offsetLeft,
          a = l / 2 + s,
          t = function(e) {
            var t = o.x - e.clientX,
              n = o.y - e.clientY;
            o = {
              x: e.clientX,
              y: e.clientY
            }, f || (v(), window.form.activate(), window.pins.add(c, m), f = !0), r = p.offsetTop - n, i = p.offsetLeft - t, (d < r + a || r + a < u) && (r = p.offsetTop), (i > m.offsetWidth || i < 0) && (i = p.offsetLeft), p.style.top = r + "px", p.style.left = i + "px", window.form.setLocation(i, r + a)
          },
          n = function() {
            f || (v(), window.form.activate(), window.pins.add(c, m), f = !0), window.form.setLocation(i, r + a), document.removeEventListener("mousemove", t), document.removeEventListener("mouseup", n)
          };
        document.addEventListener("mousemove", t), document.addEventListener("mouseup", n), window.filter.element.addEventListener("change", w)
      },
      w = function() {
        window.utils.debounce(function() {
          var e = window.filter.apply(c);
          e.length || window.showAlert("Не найдено похожих объявлений. Измените настройки фильтра.", "error"), window.card.close(), window.pins.add(e, m)
        })
      };
    window.backend.download(function(e) {
      c = e.data || e, p.addEventListener("mousedown", t)
    }, function(e) {
      window.showAlert(e, "error")
    }), window.form.setLocation(p.offsetLeft, p.offsetTop), window.map = {
      element: e,
      deactivate: function() {
        window.card.close(), window.pins.remove(m), e.classList.add("map--faded"), p.style = "", f = !1, window.form.deactivate(), window.uploadPhoto.clear(), window.filter.reset(), window.form.setLocation(p.offsetLeft, p.offsetTop), window.filter.element.removeEventListener("change", w)
      }
    }
  }();
