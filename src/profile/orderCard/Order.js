import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";

import "./Order.css";
import OrderCard from "./OrderCard";
import Util, {
	readFirebaseDatabase,
	initializeFirebase,
} from "../../util/util";

function Order(props) {
	const state = useSelector((state) => state);
	const [userOrder, setUserOrder] = useState([]);
	const [firebaseData, setFirebaseData] = useState({});
	console.log(firebaseData);

	useEffect(() => {
		initializeFirebase();
		readFirebaseDatabase()
			.then((snapshot) => {
				if (snapshot.exists()) {
					console.log("Firebase Data From order page : ", snapshot.val());
					setFirebaseData(snapshot.val());
				} else {
					console.log("No data available");
					setFirebaseData({});
				}
			})
			.catch((error) => {
				console.error(error);
				setFirebaseData({});
			});
	}, []);
	function GetAllOrders() {
		let header = Util.header;
		header["Authorization"] =
			state.user &&
			state.user.currentUser &&
			state.user.currentUser.token &&
			`Bearer ${state.user.currentUser.token}`;

		Util.apiCall(
			"GET",
			Util.baseUrl,
			`customer/order?orderDetail=1&productDetail=1&sortType=ASC`,
			header
		)
			.then((dt) => {
				console.log(dt, "User Orders");
				setUserOrder(dt.data && dt.data.reverse());
			})
			.catch((e) => {
				//console.log('this error')
				console.log(e);
			});
	}

	useEffect(() => {
		GetAllOrders();
	}, []);
	return (
		<>
			{userOrder && userOrder ? (
				userOrder.map((data, i) => {
					return (
						<div
							key={i}
							className="order__outerbox"
							style={{ marginBottom: "4px" }}
						>
							<OrderCard dbDetail={data} fbDetail={firebaseData} />
						</div>
					);
				})
			) : (
				<div>No records found 🤦‍♂️ 🤦‍♀️</div>
			)}
		</>
	);
}

export default Order;
