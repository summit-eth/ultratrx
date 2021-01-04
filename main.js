var CONTRACT_ADDRESS = "TQGVQv6ED6hqFWLYZxBnGSAUDpQVc8yjZ9";
var SOFT_LAUNCH = 1609804800; 
var FULL_LAUNCH = 1609819200; 

window.tronified = {}

var DateHelper = {
  // Takes the format of "Jan 15, 2007 15:45:00 GMT" and converts it to a relative time
  // Ruby strftime: %b %d, %Y %H:%M:%S GMT
  time_ago_in_words_with_parsing: function(from) {
    var date = new Date;
    date.setTime(Date.parse(from));
    return this.time_ago_in_words(date);
  },
  // Takes a timestamp and converts it to a relative time
  // DateHelper.time_ago_in_words(1331079503000)
  time_ago_in_words: function(from, fixed = true) {
    return this.distance_of_time_in_words(new Date, from, fixed);
  },

  distance_of_time_in_words: function(to, from, fixed = true) {
    var distance_in_seconds = ((to - from) / 1000);
    var distance_in_minutes = Math.floor(distance_in_seconds / 60);
    var tense = distance_in_seconds < 0 ? "" : " ago";
    distance_in_minutes = Math.abs(distance_in_minutes);
    if (distance_in_minutes == 0) { return 'less than a minute'+tense; }
    if (distance_in_minutes == 1) { return 'a minute'+tense; }
    if (distance_in_minutes < 45) { return distance_in_minutes + ' minutes'+tense; }
    if (distance_in_minutes < 90) { return 'about an hour'+tense; }
    if (distance_in_minutes < 1440) { return 'about ' + Math.floor(distance_in_minutes / 60) + ' hours'+tense; }
    if (distance_in_minutes < 2880) { return 'a day'+tense; }
    if(fixed == false){
      if (distance_in_minutes < 48000) { return Math.floor(distance_in_minutes / 1440) + ' days'+tense; }
      if (distance_in_minutes < 86400) { return 'about a month'+tense; }
      if (distance_in_minutes < 525960) { return Math.floor(distance_in_minutes / 43200) + ' months'+tense; }
      if (distance_in_minutes < 1051199) { return 'about a year'+tense; }
      return 'over ' + Math.floor(distance_in_minutes / 525960) + ' years';
    } else {
      if (distance_in_minutes < 86400) { return Math.floor(distance_in_minutes / 1440) + ' days'+tense; }
      return '∞';
    }
  }
};

function updateLaunchCountdown() {
  function pad(num) {
    return num > 9 ? num : '0'+num;
  };
  var
	now = new Date(),
	kickoff = new Date(SOFT_LAUNCH * 1000), // Either new or .parse(), not both!
	diff = kickoff - now,
	days = Math.floor( diff / (1000*60*60*24) ),
	hours = Math.floor( diff / (1000*60*60) ),
	mins = Math.floor( diff / (1000*60) ),
	secs = Math.floor( diff / 1000 ),
	dd = days,
	hh = hours - days * 24,
	mm = mins - hours * 60,
	ss = secs - mins * 60;
	document.querySelectorAll("*[data-update='launch-countdown']").forEach(function(e){
    e.innerHTML =
        dd + ' days ' +
        pad(hh) + ':' + //' hours ' +
        pad(mm) + ':' + //' minutes ' +
        pad(ss) ; //+ ' seconds' ;

  })
}
function updateDoubleCountdown() {
  function pad(num) {
    return num > 9 ? num : '0'+num;
  };
  var
	now = new Date(),
	kickoff = new Date(FULL_LAUNCH * 1000), // Either new or .parse(), not both!
	diff = kickoff - now,
	days = Math.floor( diff / (1000*60*60*24) ),
	hours = Math.floor( diff / (1000*60*60) ),
	mins = Math.floor( diff / (1000*60) ),
	secs = Math.floor( diff / 1000 ),
	dd = days,
	hh = hours - days * 24,
	mm = mins - hours * 60,
	ss = secs - mins * 60;
	document.querySelectorAll("*[data-update='double-countdown']").forEach(function(e){
    e.innerHTML =
        dd + ' days ' +
        pad(hh) + ':' + //' hours ' +
        pad(mm) + ':' + //' minutes ' +
        pad(ss) ; //+ ' seconds' ;

  })
}


function roundToFour(num) {
	return +(Math.floor(num + "e+4") + "e-4");
}
function roundToTwo(num) {
	return +(Math.floor(num + "e+2") + "e-2");
}

function num(val){
  return roundToFour(window.tronWeb.toDecimal(val) / 1000000);
}

function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
		vars[key] = value;
	});
	return vars;
}

function load_contract_details(){
  window.tronified.contract.contractInfo().call()
    .then(function(response){
      document.querySelectorAll("*[data-update='global_total_invested']").forEach(function(e){
        e.innerHTML = roundToTwo(window.tronWeb.toDecimal(response._total_invested)/ 1000000);
      })
      document.querySelectorAll("*[data-update='global_total_investors']").forEach(function(e){
        e.innerHTML = window.tronWeb.toDecimal(response._total_investors);
      })
      document.querySelectorAll("*[data-update='global_total_referral_bonus']").forEach(function(e){
        e.innerHTML = roundToTwo(window.tronWeb.toDecimal(response._total_referral_bonus) / 1000000);
      })
      document.querySelectorAll("*[data-update='global_total_withdrawn']").forEach(function(e){
        e.innerHTML = roundToTwo(window.tronWeb.toDecimal(response._total_withdrawn)/ 1000000);
      })
    })
    .catch(function(err){ swal("Oh no :/", err, "error") })
}

function load_account_details(){
  if(window.tronified.address != undefined && window.tronified.address != null){
    window.tronified.contract.userInfo(window.tronified.address).call()
      .then(function(response){
        for(var i = 0; i < response.referrals.length; i++){
          document.querySelectorAll("*[data-update='lvl"+(i+1)+"']").forEach(function(e){
            e.innerHTML = roundToFour(window.tronWeb.toDecimal(response.referrals[i]));
          })
        }
        document.querySelectorAll("*[data-update='total_withdrawable']").forEach(function(e){
          e.innerHTML = roundToFour(window.tronWeb.toDecimal(response.for_withdraw) / 1000000);
        })
        document.querySelectorAll("*[data-update='total_referral_withdrawable']").forEach(function(e){
          e.innerHTML = roundToFour(window.tronWeb.toDecimal(response.withdrawable_referral_bonus) / 1000000);
        })
        document.querySelectorAll("*[data-update='total_invested']").forEach(function(e){
          e.innerHTML = roundToFour(window.tronWeb.toDecimal(response.invested) / 1000000);
        })
        document.querySelectorAll("*[data-update='total_withdrawn']").forEach(function(e){
          e.innerHTML = roundToFour(window.tronWeb.toDecimal(response.withdrawn) / 1000000);
        })
        document.querySelectorAll("*[data-update='total_referral_bonus']").forEach(function(e){
          e.innerHTML = roundToFour(window.tronWeb.toDecimal(response.referral_bonus) / 1000000);
        })
      })
      .catch(function(err){ swal("Oh no :/", err, "error") })
  }
}

function load_account_balance(){
  if(window.tronified.address != undefined && window.tronified.address != null){
    window.tronWeb.trx.getAccount(window.tronified.address)
    .then(function(response){
      document.getElementById("your_balance").innerHTML = roundToFour(response.balance / 1000000)
    })
    .catch(function(err){ swal("Oh no :/", err, "error") })
  }
}

function load_account_payments(){
  if(window.tronified.address != undefined && window.tronified.address != null){
    window.tronified.contract.investmentsInfo(window.tronified.address).call()
    .then(function(response){
      var table = document.getElementById("your_investments")
      if(response.amounts.length > 0){
        table.innerHTML = "";
        var c = 0;
        for(var i = (response.amounts.length-1); i >= 0; i--){
          var left = new Date(window.tronWeb.toDecimal(response.endTimes[i]._hex) * 1000);
          table.innerHTML += "<div class='card shadow-sm mb-3'><div class='card-body p-2 pl-3 pr-3'>" +
            '<h4 class="mb-0">' +
              num(response.amounts[i])+' <small>TRX</small>' +
            '</h4>' +
            '<p class="lead mb-0">'+ num(response.totalWithdraws[i]._hex) +' <small class="text-muted">TRX Withdrawn</small> ('+roundToTwo(num(response.totalWithdraws[i]._hex)/(num(response.amounts[i]._hex)/100))+'%)</p> <br>' +
            
//            '<h5 class="mb-0">' +
//            (left > new Date() ? '<span class="float-sm-none" style="margin-top:-4px"><small style="font-size:12px">Time left</small><br>'+DateHelper.time_ago_in_words(left)+'</span>' : '<span class="float-sm-none text-info">Finished</span>')+
//            '</h5>' +
            
          "</div></div>";
          c += 1;
        }
        if(response.amounts.length > 8){
          table.innerHTML += "<tr class='showall'><td class='p-0' colspan='4'><a href='#load_all_payments' onclick='document.querySelectorAll(\"#account_payments tr\").forEach(function(item){ item.style.display=\"table-row\" }); document.querySelector(\"#account_payments .showall\").remove()' class='btn btn-outline-secondary btn-block btn-sm'>Load all past deposits</a></td></tr>";
        }
      }
    })
    .catch(function(err){ swal("Oh no :/", err, "error") })
  }
}

function deposit(value){
  window.tronified.contract.deposit(window.referral).send({ callValue: value * 1000000 })
  .then(function(response){
    swal("Deposited!", "You deposited "+value + " TRX", "success");
    window.setTimeout(function(){ load_account_payments(); load_account_balance(); load_account_details() }, 500);
    window.setTimeout(function(){ load_account_payments() }, 3000);
  })
  .catch(function(err){ swal("Oh no :/", err, "error") })
}

document.addEventListener('DOMContentLoaded', function(){
  window.referral = 'TLcrenBEBPFUKxAR9AdXqzLdFqqxrbJXhp';
  var urlParams = new URLSearchParams(window.location.search);
  var r = urlParams.get('r')
  console.log(r);
  if(r != undefined && r != null){
    window.referral = r;
    if(localStorage != undefined){
     localStorage.unicorn_referral = window.referral
    }
    console.log("Referral: "+window.referral)
  } else if(localStorage.unicorn_referral != undefined){
    window.referral = localStorage.unicorn_referral;
  }
  console.log("Referral: "+window.referral)
  console.log(window.referral);

  if((new Date()/1000) < SOFT_LAUNCH){
    document.getElementById("invest").classList.add('early');
    document.getElementById("header_loading").style.display = 'none';
    document.getElementById("header_countdown").style.display = 'block';
    updateLaunchCountdown();
    window.setInterval(updateLaunchCountdown, 1000);
    window.setInterval(function(){ window.location.reload() }, ((SOFT_LAUNCH - (new Date()/1000)) * 1000));
  } else {
    document.getElementById("header_loading").style.display = 'none';
    document.getElementById("header_contract_details").style.display = 'block';
  }

  if((new Date()/1000) > FULL_LAUNCH){
    document.getElementById("double_referral_rewards").style.display = 'none';
    document.querySelectorAll('.pre_launch').forEach(function(e){
      e.style.display = 'none';
    })
    document.querySelectorAll('.full_launch').forEach(function(e){
      e.style.display = 'block';
    })
  } else {
    updateDoubleCountdown();
    window.setInterval(updateDoubleCountdown, 1000);
  }

  function inViewport( element ){
    var bb = element.getBoundingClientRect();
    return !(bb.top > innerHeight || bb.bottom < 0);
  }
  document.querySelectorAll('section').forEach(function(elem){
    document.addEventListener('scroll', event => {
      if( inViewport( elem ) && !(elem.classList.contains('visible'))){
        elem.classList.add('visible');
        elem.querySelectorAll('.animate_when_visible').forEach(function(e){
          e.classList.add('animate__animated')
        })
      }
    })
  })

  var failure_count = 0;
  var load_obj = setInterval(async ()=>{
      if (window.tronWeb && window.tronWeb.defaultAddress.base58) {
        clearInterval(load_obj)
        window.tronified.address = window.tronWeb.defaultAddress.base58;
        window.tronified.contract = await window.tronWeb.contract().at(CONTRACT_ADDRESS)
          .catch(function(err){ swal("Oh no :/", err, "error") })

        load_account_details()
        load_account_balance()
        load_contract_details()
        load_account_payments()

        document.getElementById("your_address").innerHTML = window.tronified.address
        document.getElementById("referral_link").value = "https://ultratrx.club?r="+window.tronified.address;
        document.getElementById("your_adr").innerHTML = "<i class='fa fa-lock mr-2 text-success'></i> "+window.tronified.address.substring(0,12)+"...";
        document.getElementById("your_adr").setAttribute("href", "#")

        window.setInterval(load_account_details, 2500)
        window.setInterval(load_account_balance, 5000)
        window.setInterval(load_contract_details, 5000)
        // document.getElementById("loading").style.display = 'none';
        // document.getElementById("no_wallet").style.display = 'none';
      } else {
        failure_count += 1;
        // document.getElementById("no_wallet").style.display = 'block';
      }
      if(failure_count == 12){
        clearInterval(load_obj)
        swal("No Tron Wallet detected", "Please install or enable a Tron Wallet like TronLink", "error", {
          buttons: {
            get: {
              text: "Get TronLink",
              value: "get"
            },
            cancel: "Cancel"
          },
        }).then((val) => {
          if(val == "get"){
            var win = window.open("https://www.tronlink.org/", '_blank');
            win.focus();
          }
        });
      }
  }, 250);

  window.setInterval(function(){
    if(window.tronified.address != window.tronWeb.defaultAddress.base58){
      window.tronified.address = window.tronWeb.defaultAddress.base58;
      document.getElementById("your_address").innerHTML = window.tronified.address;
      document.getElementById("referral_link").value = "https://ultratrx.club?r="+window.tronified.address;
      document.getElementById("your_adr").innerHTML = "<i class='fa fa-lock mr-2 text-success'></i> "+window.tronified.address.substring(0,12)+"...";
      document.getElementById("your_adr").setAttribute("href", "#")
      load_account_balance()
    }
  }, 500)

  document.getElementById("invest_now").addEventListener('click', async ()=>{ deposit( document.getElementById("invest_amount").value) });
  document.getElementById("withdraw").addEventListener('click', async (e)=>{
    e.preventDefault();
	if(new Date().getTime() < FULL_LAUNCH * 1e3) {
		  function pad(num) {
			return num > 9 ? num : '0'+num;
		  };
		  var
			now = new Date(),
			kickoff = new Date(FULL_LAUNCH * 1000), // Either new or .parse(), not both!
			diff = kickoff - now,
			days = Math.floor( diff / (1000*60*60*24) ),
			hours = Math.floor( diff / (1000*60*60) ),
			mins = Math.floor( diff / (1000*60) ),
			secs = Math.floor( diff / 1000 ),
			dd = days,
			hh = hours - days * 24,
			mm = mins - hours * 60,
			ss = secs - mins * 60;
		alert("Withdrawable After Official Launch in " + 
				pad(hh) + ':' + //' hours ' +
				pad(mm) + ':' + //' minutes ' +
				pad(ss)) ; //+ ' seconds' ;
	} else {
		window.tronified.contract.withdraw().send()
		.then(response => swal("Withdrawn!", "You have withdrawn your balance", "success"))
		.catch(function(err){ swal("Oh no :/", err, "ERROR") })
	}
  });
  // document.getElementById("reinvest").addEventListener('click', async (e)=>{
  //   e.preventDefault();
  //   window.tronified.contract.reinvest().send()
  //   .then(response => swal("Reinvested!", "You reinvested your balance", "success"))
  //   .catch(function(err){ swal("Oh no :/", err, "error") })
  // });
})
