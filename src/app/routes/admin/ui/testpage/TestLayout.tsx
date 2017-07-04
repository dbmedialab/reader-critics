import * as React from 'react';

// Common components
import Header from 'front/common/Header';
import Footer from 'front/common/Footer';
import TestContainer from 'app/routes/admin/ui/testpage/TestContainer';

const TestLayout : React.StatelessComponent <any> =
	() => <div>
		<Header/>
		<TestContainer/>
		<Footer/>
	</div>;

export default TestLayout;
