import React from 'react';
import ReactDOM from 'react-dom';
import 'assets/css/App.css';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import AuthLayout from 'layouts/auth';
import AdminLayout from 'layouts/admin';
import RtlLayout from 'layouts/rtl';
import { ChakraProvider } from '@chakra-ui/react';
import theme, { mutableTheme } from 'theme/theme';
import { ThemeEditorProvider } from '@hypertheme-editor/chakra-ui';

const AppContent = () => (
  <HashRouter>
    <Switch>
      <Route path={`/auth`} component={AuthLayout} />
      <Route path={`/admin`} component={AdminLayout} />
      <Route path={`/rtl`} component={RtlLayout} />
      <Redirect from='/' to='/admin' />
    </Switch>
  </HashRouter>
);
 
ReactDOM.render(
	<ChakraProvider theme={mutableTheme}>
		<ThemeEditorProvider theme={mutableTheme}>
			<AppContent />
		</ThemeEditorProvider>
	</ChakraProvider>,
	document.getElementById('root')
);
