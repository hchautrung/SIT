import React from "react";

import {BrowserRouter, Routes, Route, Link} from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import HomeUI from './ui/HomeUI';
import SignInUI from './ui/SignInUI';
import ReportUI from "./ui/ReportUI";
import WithoutSidebar from "./layouts/WithoutSidebar";
import WithSidebar from "./layouts/WithSidebar";
import { signOut } from './actions/userAction';

function App() {
	const dispatch = useDispatch();
	const {userInfo} = useSelector(state => state.userSignIn);

	const signOutHandler = () => {
		dispatch(signOut());
	}

	return (
		<BrowserRouter>
			<div className="grid-container">
				<div className="header row">
					<div>
						<Link to="/" className="brand">SIT Community</Link>
					</div>
					<div>
						{
							userInfo && 	
								(<div className="dropdown">
									<Link to="#">
										{userInfo.name} <i className="fa fa-caret-down" ></i>
									</Link>
									<ul className="dropdown-content">	
										<li>
											<Link to="#signout" onClick={signOutHandler}>Sign Out</Link>
										</li>
									</ul>
								</div>)
						}
					</div>
				</div>
				<div className="content">
					{/*
					<NavBar menu={Menu} style={{backgroundColor: "#282c34"}} />
					<Layout style={{backgroundColor: "#282c34"}}>
						<SideBar menu={Menu} />
						<Layout.Content>
						<Routes>
							<Route path="/signin"  element={<SignInUI />} />
							<Route path="/"  element={<HomeUI />} />
							<Route path="/report" element={<ReportUI />} />
						</Routes>
						</Layout.Content>
					</Layout>
					*/}

					<Routes>
						<Route element={<WithSidebar />}>
							<Route path="/" strict element={<HomeUI />}></Route>
						</Route>
						<Route element={<WithoutSidebar />}>
							<Route path="/signin" strict element={<SignInUI />}></Route>
						</Route>
						<Route element={<WithSidebar />}>
							<Route path="/report" strict element={<ReportUI />}></Route>
						</Route>
					</Routes>
					
				</div>
				<div className="footer row center">
					<div>All rights reserved</div>
				</div>
			</div>
		</BrowserRouter>
	);
}

export default App;
