import React from 'react';
import { Platform, WebView } from 'react-native';
import PropTypes from 'prop-types';
import withInterceptLink from './withInterceptLink';
import withJsBridge from './withJsBridge';
import withQuery from './withQuery';

class WebViewWithRef extends React.Component {
  static propTypes = {
    getWebView: PropTypes.func.isRequired,
    query: PropTypes.shape({
      token: PropTypes.string,
      userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      appName: PropTypes.string.isRequired,
      appVersion: PropTypes.string.isRequired,
      appType: PropTypes.string,
    }),
    onWebRequest: PropTypes.func.isRequired,
    getUtilities: PropTypes.func,
  };

  static defaultProps = {
    query: {
      token: '',
      userId: '',
      appType: Platform.select({ ios: 'iOS', android: 'Android' }),
    },
  };

  render() {
    const { url, ...passProps } = this.props;
    if (url) {
      console.log('should not pass url to WebView');
    }
    return (
      <WebView
        {...passProps}
        ref={ref => this.props.getWebView(ref)}
      />
    );
  }
}

/* eslint-disable */
const copyProps = WrappedWebView => class extends React.Component {
  render() {
    const { navigation } = this.props;
    const { dispatch, state } = navigation || {};
    const { params } = state || {};
    const copiedProps = dispatch && params ? params : {};
    return (
      <WrappedWebView
        {...this.props}
        {...copiedProps}
      />
    );
  }
};
/* eslint-enable */

const baseHocs = [copyProps, withJsBridge, withQuery, withInterceptLink];

export const withExtra = (...hocs) => {
  return baseHocs.concat(hocs).reduceRight((res, it) => it(res), WebViewWithRef);
};

export default withExtra();
