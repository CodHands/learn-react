/*** GENERAL COMPONENTS ***/
// Button that moves to next page
var NextBtn = React.createClass({
	render: function() {
		return (
			<a href={this.props.href} className="button" onClick={this.props.navToPage}>Next &raquo;</a>
		);
	}
});

var PrevBtn = React.createClass({
	render: function() {
		return (
			<a href={this.props.href} className="button" onClick={this.props.navToPage}>&laquo; Prev</a>
		);
	}
});


/*** CORE COMPONENTS ***/
// The top header area of the page
var Header = React.createClass({
	render: function() {
		return (
			<div id="header">
				<div className="fit">
					<h1>React Pizzaria</h1>
				</div>
			</div>
		);
	}
});

// The content area of the page. Manages routing.
var Content = React.createClass({
	getInitialState: function() {
		return {currPage: <MenuPage navToPage={this.navToPage} />};
	},

	navToPage: function(event) {
		event.preventDefault();

		var shopPaths = ['/', '/delivery', '/payment', '/placeorder'];
		var newPath = event.target.pathname;

		history.pushState(null,null,newPath);

		for(var path in shopPaths) {
			if(newPath === shopPaths[0]) {
				this.setState({currPage: <MenuPage navToPage={this.navToPage} />});
				break;
			} else if(newPath === shopPaths[1]) {
				this.setState({currPage: <DeliveryPage navToPage={this.navToPage} />});
				break;
			} else if(newPath === shopPaths[2]) {
				this.setState({currPage: <PaymentPage navToPage={this.navToPage} />});
				break;
			} else if(newPath === shopPaths[3]) {
				this.setState({currPage: <PlaceOrderPage navToPage={this.navToPage} />});
				break;
			}
		}
	},

	render: function() {
		return (
			<div id="content">
				{this.state.currPage}
			</div>
		);
	}
});


/*** MENU PAGE ***/
var MenuPage = React.createClass({
	render: function() {
		return (
			<div className="fit">
				<h1>Menu</h1>
				<ProductList url="products.json" />
				<NextBtn href="delivery" navToPage={this.props.navToPage} />
			</div>
		);
	}
});

// The list of products
var ProductList = React.createClass({
	getInitialState: function() {
		return {data: []};
	},

	// Download the products from server's JSON through AJAX
	componentDidMount: function() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.log(this.props.url, status, err.toString());
			}.bind(this)
		});
	},

	render: function() {
		var productNodes = this.state.data.map(function (product) {
			return (
				<Product name={product.name} desc={product.desc} />
			);
		});
		return (
			<div id="menu">
				<ProductFilter />
				<ul id="product-list">
					{productNodes}
				</ul>
			</div>
		);
	}
});

// An individual product
var Product = React.createClass({
	getInitialState: function() {
		var initIsOrdered = localStorage.getItem(this.props.name);
		var initHighlightState = '';

		// Load the stored values from localStorage if there are any
		if(initIsOrdered === 'true') {
			initIsOrdered = true;
			initHighlightState = 'highlight';
		} else {
			initIsOrdered = false;
		}

		return {
			isOrdered: initIsOrdered,
			highlightState: initHighlightState
		};
	},

	// Controls style of button depending on its highlightState
	highlightCtrl: function() {
		this.setState({isOrdered: !this.state.isOrdered}, function() {
			if(this.state.isOrdered) {
				this.setState({highlightState: 'highlight'});
			} else {
				this.setState({highlightState: ''});
			}

			localStorage.setItem(this.props.name, this.state.isOrdered);
		});
	},

	render: function() {
		return (
			<li className={this.state.highlightState} onClick={this.highlightCtrl}>
				<h2>{this.props.name}</h2>
				<p>{this.props.desc}</p>
			</li>
		);
	}
});

// Filter that shows and hides products
var ProductFilter = React.createClass({
	render: function() {
		return (
			<div id="product-filter">
				<input placeholder="Search for food items..."></input>
			</div>
		);
	}
});


/*** DELIVERY PAGE ***/
var DeliveryPage = React.createClass({
	getInitialState: function() {
		// Load the stored values from localStorage if there are any
		var initName = localStorage.getItem('name');
		var initPhone = localStorage.getItem('phone');
		var initAddressLine1 = localStorage.getItem('address-line-1');
		var initAddressLine2 = localStorage.getItem('address-line-2');
		var initCity = localStorage.getItem('city');
		var initState = localStorage.getItem('state');
		var initZip = localStorage.getItem('zip');

		if(initName === undefined) {
			initName = '';
		}
		
		if(initPhone === undefined) {
			initPhone = '';
		}

		if(initAddressLine1 === undefined) {
			initAddressLine1 = '';
		}

		if(initAddressLine2 === undefined) {
			initAddressLine1 = '';
		}
		
		if(initCity === undefined) {
			initCity = '';
		}
		
		if(initState === undefined) {
			initState = '';
		}

		if(initZip === undefined) {
			initZip= '';
		}

		return {
			name: initName,
			phone: initPhone,
			addressLine1: initAddressLine1,
			addressLine2: initAddressLine2,
			city: initCity,
			region: initState,
			zip: initZip
		};
	},
	addressSet: function(event) {
		localStorage.setItem(event.target.name, event.target.value);
	},
	timeSelect: function(event) {
		localStorage.setItem('time', event.target.value);
	},
	render: function() {
		return (
			<div id="delivery-page" className="fit">
				<h1>Delivery</h1>
				<h2>Who do we contact?</h2>
				<label>
					Name:
					<input type="text" name="name" onChange={this.addressSet} defaultValue={this.state.name} />
				</label>
				<label> 
					Phone Number:
					<input type="tel" name="phone" onChange={this.addressSet} defaultValue={this.state.phone} />
				</label>
				<h2>Where do you want your food?</h2>
				<label>
					Address line 1:
					<input type="text" name="address-line-1" onChange={this.addressSet} defaultValue={this.state.addressLine1} />
				</label>
				<label>
					Address line 2:
					<input type="text" name="address-line-2" onChange={this.addressSet} defaultValue={this.state.addressLine2} />
				</label>
				<label>
					City:
					<input type="text" name="city" onChange={this.addressSet} defaultValue={this.state.city} />
				</label>
				<label>
					State:
					<input type="text" name="state" onChange={this.addressSet} defaultValue={this.state.region} />
				</label>
				<label>
					ZIP
					<input type="text" name="zip" onChange={this.addressSet} defaultValue={this.state.zip} />
				</label>
				<h2>When do you want your food?</h2>
				<ul>
					<li>
						<label>
							<input type="radio" value="ASAP" name="delivery-time" onClick={this.timeSelect} />
							<p>As soon as possible!</p>
						</label>
					</li>
					<li>
						<label>
							<input type="radio" value="set-time" name="delivery-time" onClick={this.timeSelect} />
							<input type="date" />
							<input type="time" />
						</label>
					</li>
				</ul>
				<PrevBtn href="/" navToPage={this.props.navToPage} />
				<NextBtn href="/payment" navToPage={this.props.navToPage} />
			</div>
		);
	}
});


/** PAYMENT PAGE **/
var PaymentPage = React.createClass({
	cardSelect: function(event) {
		localStorage.setItem('card', event.target.value)
	},
	render: function() {
		return (
			<div id="payment-page" className="fit">
				<h1>Payment</h1>
				<table>
					<thead>
						<tr>
							<td>Your Cards</td>
							<td>Name On Card</td>
							<td>Expires On</td>
						</tr>
					</thead>
					<tbody>
						<tr>
							<td><input type="radio" value="Visa 1234" name="card" onClick={this.cardSelect} />Visa ending in 1234</td>
							<td>Peregrine Robinson</td>
							<td>01/2020</td>
						</tr>
						<tr>
							<td><input type="radio" value="Mastercard 4567" name="card" onClick={this.cardSelect} />Mastercard ending in 4567</td>
							<td>Peregrine Robinson</td>
							<td>01/2020</td>
						</tr>
						<tr>
							<td><input type="radio" value="Discover 8901" name="card" onClick={this.cardSelect} />Discover ending in 8901</td>
							<td>Peregrine Robinson</td>
							<td>01/2020</td>
						</tr>
					</tbody>
				</table>
				<PrevBtn href="/delivery" navToPage={this.props.navToPage} />
				<NextBtn href="/placeorder" navToPage={this.props.navToPage} />
			</div>
		);
	}
});


/** PLACE ORDER PAGE **/
var PlaceOrderPage = React.createClass({
	getInitialState: function() {
		var initName = localStorage.getItem('name');
		var initPhone = localStorage.getItem('phone');
		var initAddressLine1 = localStorage.getItem('address-line-1');
		var initAddressLine2 = localStorage.getItem('address-line-2');
		var initCity = localStorage.getItem('city');
		var initState = localStorage.getItem('state');
		var initZip = localStorage.getItem('zip');
		var initTime = localStorage.getItem('time');
		var initCard = localStorage.getItem('card');

		return {
			name: initName,
			phone: initPhone,
			addressLine1: initAddressLine1,
			addressLine2: initAddressLine2,
			city: initCity,
			region: initState,
			zip: initZip,
			time: initTime,
			card: initCard
		};
	},

	render: function() {
		return (
			<div id="place-order-page" className="fit">
				<h1>Review Your Order</h1>
				<h2>You ordered...</h2>
				<h2>We are delivering to...</h2>
				<p>{this.state.name} at {this.state.phone} at the following address:</p>
				<p>{this.state.addressLine1}, {this.state.addressLine2}, {this.state.city}, {this.state.region}, {this.state.zip}</p>
				<h2>You are paying with...</h2>
				<p>{this.state.card}</p>
				<PrevBtn href="/payment" navToPage={this.props.navToPage} />
			</div>
		);
	}
});


React.render(
	<div id="wrapper">
		<Header />
		<Content />
	</div>,
	document.querySelector('body')
);
