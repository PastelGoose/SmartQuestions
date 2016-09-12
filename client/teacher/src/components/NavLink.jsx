import React from 'react';
import { Link } from 'react-router';

/* Wraps router Links so that you don't have to rememver to add the activeClassName attribute, as per the router
documentation. Probably not worth having, given that we ended up styling different nav links differently.*/

var NavLink = (props) => (
  <Link {...props} activeClassName="active"/>
);

export default NavLink;