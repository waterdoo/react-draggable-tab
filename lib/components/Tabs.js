'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

var _invariant = require('invariant');

var _invariant2 = _interopRequireDefault(_invariant);

var _classnames = require('classnames');

var _classnames2 = _interopRequireDefault(_classnames);

var _mousetrap = require('mousetrap');

var _mousetrap2 = _interopRequireDefault(_mousetrap);

var _CustomDraggable = require('./CustomDraggable');

var _CustomDraggable2 = _interopRequireDefault(_CustomDraggable);

var _Tab = require('./Tab');

var _Tab2 = _interopRequireDefault(_Tab);

var _TabStyles = require('./TabStyles');

var _TabStyles2 = _interopRequireDefault(_TabStyles);

var _TabContainer = require('./TabContainer');

var _TabContainer2 = _interopRequireDefault(_TabContainer);

var _CloseIcon = require('./CloseIcon');

var _CloseIcon2 = _interopRequireDefault(_CloseIcon);

var _styleOverride = require('../helpers/styleOverride');

var _styleOverride2 = _interopRequireDefault(_styleOverride);

var _utils = require('../helpers/utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Tabs = function (_React$Component) {
  _inherits(Tabs, _React$Component);

  function Tabs(props) {
    _classCallCheck(this, Tabs);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Tabs).call(this, props));

    var tabs = _this._tabStateFromProps(_this.props).tabs;
    var selectedTab = '';
    if (_this.props.selectedTab) {
      selectedTab = _this.props.selectedTab;
    } else if (_this.props.tabs) {
      selectedTab = _this.props.tabs[0].key;
    }
    var hoveredTab = '';
    var closedTabs = [];
    var defaultState = {
      tabs: tabs,
      selectedTab: selectedTab,
      hoveredTab: hoveredTab,
      closedTabs: closedTabs
    };

    _this.state = defaultState;

    // Dom positons
    // do not save in state
    _this.startPositions = [];
    _this.dragging = false;
    return _this;
  }

  _createClass(Tabs, [{
    key: '_tabStateFromProps',
    value: function _tabStateFromProps(props) {
      var tabs = [];
      var idx = 0;
      _react2.default.Children.forEach(props.tabs, function (tab) {
        (0, _invariant2.default)(tab.key, 'There should be unique key in each Tab');

        tabs[idx] = tab;
        idx++;
      });

      return {
        tabs: tabs
      };
    }
  }, {
    key: '_isClosed',
    value: function _isClosed(key) {
      return this.state.closedTabs.indexOf(key) > -1;
    }
  }, {
    key: '_getIndexOfTabByKey',
    value: function _getIndexOfTabByKey(key) {
      return _lodash2.default.findIndex(this.state.tabs, function (tab) {
        return tab.key === key;
      });
    }
  }, {
    key: '_getTabByKey',
    value: function _getTabByKey(key) {
      return _lodash2.default.where(this.state.tabs, function (tab) {
        return tab.key === key;
      });
    }
  }, {
    key: '_getNextTabKey',
    value: function _getNextTabKey(key) {
      var nextKey = void 0;
      var current = this._getIndexOfTabByKey(key);
      if (current + 1 < this.state.tabs.length) {
        nextKey = this.state.tabs[current + 1].key;
        if (this._isClosed(nextKey)) {
          nextKey = this._getNextTabKey(nextKey);
        }
      }
      return nextKey;
    }
  }, {
    key: '_getPrevTabKey',
    value: function _getPrevTabKey(key) {
      var prevKey = void 0;
      var current = this._getIndexOfTabByKey(key);
      if (current > 0) {
        prevKey = this.state.tabs[current - 1].key;
        if (this._isClosed(prevKey)) {
          prevKey = this._getPrevTabKey(prevKey);
        }
      }
      return prevKey;
    }
  }, {
    key: '_getCurrentOpenTabs',
    value: function _getCurrentOpenTabs() {
      return this._getOpenTabs(this.state.tabs);
    }
  }, {
    key: '_getOpenTabs',
    value: function _getOpenTabs(tabs) {
      var _this2 = this;

      return _lodash2.default.filter(tabs, function (tab) {
        return !_this2._isClosed(tab.key);
      });
    }
  }, {
    key: '_moveTabPosition',
    value: function _moveTabPosition(key1, key2) {
      var t1 = this._getIndexOfTabByKey(key1);
      var t2 = this._getIndexOfTabByKey(key2);
      return _utils2.default.slideArray(this.state.tabs, t1, t2);
    }
  }, {
    key: '_saveStartPositions',
    value: function _saveStartPositions() {
      var _this3 = this;

      var positions = _lodash2.default.map(this.state.tabs, function (tab) {
        var el = _reactDom2.default.findDOMNode(_this3.refs[tab.key]);
        var pos = el ? el.getBoundingClientRect() : {};
        return {
          key: tab.key,
          pos: pos
        };
      });
      // Do not save in state
      this.startPositions = positions;
    }
  }, {
    key: '_cancelEventSafety',
    value: function _cancelEventSafety(e) {
      var ev = e;
      if (typeof e.preventDefault !== 'function') {
        ev.preventDefault = function () {};
      }
      if (typeof e.stopPropagation !== 'function') {
        ev.stopPropagation = function () {};
      }
      ev.preventDefault();
      //comment out to prevent close of popover in react-bootstrap Overlay rootClose method
      // ev.stopPropagation(); 
      return ev;
    }
  }, {
    key: 'componentWillMount',
    value: function componentWillMount() {}
  }, {
    key: 'componentDidMount',
    value: function componentDidMount() {
      this._saveStartPositions();
      this.bindShortcuts();
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      this.unbindShortcuts();
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      var newState = this._tabStateFromProps(nextProps);
      if (nextProps.selectedTab !== 'undefined') {
        newState.selectedTab = nextProps.selectedTab;
      }
      // reset closedTabs, respect props from application
      newState.closedTabs = [];
      this.setState(newState);
    }
  }, {
    key: 'componentWillUpdate',
    value: function componentWillUpdate() {}
  }, {
    key: 'componentDidUpdate',
    value: function componentDidUpdate() {
      this._saveStartPositions();
    }
  }, {
    key: 'bindShortcuts',
    value: function bindShortcuts() {
      var _this4 = this;

      if (this.props.shortCutKeys) {
        if (this.props.shortCutKeys.close) {
          _mousetrap2.default.bind(this.props.shortCutKeys.close, function (e) {
            var ev = _this4._cancelEventSafety(e);
            if (_this4.state.selectedTab) {
              _this4.handleCloseButtonClick(_this4.state.selectedTab, ev);
            }
          });
        }
        if (this.props.shortCutKeys.create) {
          _mousetrap2.default.bind(this.props.shortCutKeys.create, function (e) {
            var ev = _this4._cancelEventSafety(e);
            _this4.handleAddButtonClick(ev);
          });
        }
        if (this.props.shortCutKeys.moveRight) {
          _mousetrap2.default.bind(this.props.shortCutKeys.moveRight, function (e) {
            var ev = _this4._cancelEventSafety(e);
            _this4.moveRight(ev);
          });
        }
        if (this.props.shortCutKeys.moveLeft) {
          _mousetrap2.default.bind(this.props.shortCutKeys.moveLeft, function (e) {
            var ev = _this4._cancelEventSafety(e);
            _this4.moveLeft(ev);
          });
        }
      }
    }
  }, {
    key: 'unbindShortcuts',
    value: function unbindShortcuts() {
      _mousetrap2.default.reset();
    }
  }, {
    key: 'handleDragStart',
    value: function handleDragStart() {
      this.dragging = true;
    }
  }, {
    key: 'handleDrag',
    value: function handleDrag(key, e) {
      var _this5 = this;

      var deltaX = e.pageX || e.clientX;
      _lodash2.default.each(this.startPositions, function (pos) {
        var tempMoved = pos.moved || 0;
        var shoudBeSwap = key !== pos.key && pos.pos.left + tempMoved < deltaX && deltaX < pos.pos.right + tempMoved;
        if (shoudBeSwap) {
          var idx1 = _this5._getIndexOfTabByKey(key);
          var idx2 = _this5._getIndexOfTabByKey(pos.key);
          var minus = idx1 > idx2 ? 1 : -1;
          var movePx = minus * (pos.pos.right - pos.pos.left) - tempMoved;
          _reactDom2.default.findDOMNode(_this5.refs[pos.key]).style.transform = 'translate(' + movePx + 'px, 0px)';
          _this5.startPositions[idx2].moved = movePx;
        }
      });
    }
  }, {
    key: 'handleDragStop',
    value: function handleDragStop(key, e) {
      var _this6 = this;

      var deltaX = e.pageX || e.clientX;
      var swapedTabs = void 0;
      _lodash2.default.each(this.startPositions, function (pos) {
        var shoudBeSwap = key !== pos.key && pos.pos.left < deltaX && deltaX < pos.pos.right;
        if (shoudBeSwap) {
          swapedTabs = _this6._moveTabPosition(key, pos.key);
        }
        _reactDom2.default.findDOMNode(_this6.refs[pos.key]).style.transform = 'translate(0px, 0px)';
      });
      var nextTabs = swapedTabs || this.state.tabs;

      var newState = {
        tabs: nextTabs,
        selectedTab: key
      };
      this.dragging = false;
      this.setState(newState, function () {
        if (swapedTabs) {
          _this6.props.onTabPositionChange(e, key, _this6._getOpenTabs(nextTabs));
        }
      });
    }
  }, {
    key: 'handleTabClick',
    value: function handleTabClick(key, e) {
      var _this7 = this;

      var isBehindTab = key !== this.state.selectedTab;
      var idx = this._getIndexOfTabByKey(key);
      var isDragAfter = this.startPositions[idx].moved !== 0;
      if (isBehindTab && isDragAfter && this.props.keepSelectedTab) {
        e.preventDefault();
        return;
      }

      var classes = (e.target.getAttribute('class') || '').split(' ');
      if (classes.indexOf('rdTabCloseIcon') > -1) {
        this._cancelEventSafety(e);
      } else {
        this.setState({ selectedTab: key }, function () {
          _this7.props.onTabSelect(e, key, _this7._getCurrentOpenTabs());
        });
      }
    }
  }, {
    key: 'handleMouseEnter',
    value: function handleMouseEnter(key, onMouseEnter, e) {
      if (!this.dragging) {
        this.setState({
          hoveredTab: key
        }, function () {
          if (_lodash2.default.isFunction(onMouseEnter)) {
            onMouseEnter(e);
          }
        });
      }
    }
  }, {
    key: 'handleMouseLeave',
    value: function handleMouseLeave(key, onMouseLeave, e) {
      if (!this.dragging) {
        if (this.state.hoveredTab === key) {
          this.setState({
            hoveredTab: ''
          }, function () {
            if (_lodash2.default.isFunction(onMouseLeave)) {
              onMouseLeave(e);
            }
          });
        } else {
          if (_lodash2.default.isFunction(onMouseLeave)) {
            onMouseLeave(e);
          }
        }
      }
    }
  }, {
    key: 'handleCloseButtonClick',
    value: function handleCloseButtonClick(key, e) {
      var _this8 = this;

      var ev = this._cancelEventSafety(e);
      var nextSelected = void 0;

      if (this.state.selectedTab === key) {
        nextSelected = this._getNextTabKey(key);
        if (!nextSelected) {
          nextSelected = this._getPrevTabKey(key);
        }
      } else {
        nextSelected = this.state.selectedTab;
      }

      var shoudBeNotifyTabChange = this.state.selectedTab !== nextSelected;
      this.setState({
        closedTabs: this.state.closedTabs.concat([key]),
        selectedTab: nextSelected
      }, function () {
        var currentOpenTabs = _this8._getCurrentOpenTabs();
        _this8.props.onTabClose(ev, key, currentOpenTabs);
        if (shoudBeNotifyTabChange) {
          _this8.props.onTabSelect(ev, nextSelected, currentOpenTabs);
        }
      });
    }
  }, {
    key: 'handleAddButtonClick',
    value: function handleAddButtonClick(e) {
      this.props.onTabAddButtonClick(e, this._getCurrentOpenTabs());
    }
  }, {
    key: 'moveRight',
    value: function moveRight(e) {
      var _this9 = this;

      var nextSelected = this._getNextTabKey(this.state.selectedTab);
      if (!nextSelected) {
        nextSelected = this.props.tabs[0] ? this.props.tabs[0].key : '';
      }
      if (nextSelected !== this.state.selectedTab) {
        this.setState({ selectedTab: nextSelected }, function () {
          _this9.props.onTabSelect(e, nextSelected, _this9._getCurrentOpenTabs());
        });
      }
    }
  }, {
    key: 'moveLeft',
    value: function moveLeft(e) {
      var _this10 = this;

      var nextSelected = this._getPrevTabKey(this.state.selectedTab);
      if (!nextSelected) {
        nextSelected = _lodash2.default.last(this.props.tabs) ? _lodash2.default.last(this.props.tabs).key : '';
      }
      if (nextSelected !== this.state.selectedTab) {
        this.setState({ selectedTab: nextSelected }, function () {
          _this10.props.onTabSelect(e, nextSelected, _this10._getCurrentOpenTabs());
        });
      }
    }
  }, {
    key: 'getCloseButton',
    value: function getCloseButton(tab, style, classes, hoverStyleBase) {
      if (tab.props.disableClose) {
        return '';
      }
      var onHoverStyle = _styleOverride2.default.merge(hoverStyleBase, tab.props.tabStyles.tabCloseIconOnHover);
      return _react2.default.createElement(
        _CloseIcon2.default,
        {
          style: style,
          hoverStyle: onHoverStyle,
          className: classes,
          onClick: this.handleCloseButtonClick.bind(this, tab.key) },
        '×'
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var _this11 = this;

      // override inline tabs styles
      var tabInlineStyles = {};
      tabInlineStyles.tabWrapper = _styleOverride2.default.merge(_TabStyles2.default.tabWrapper, this.props.tabsStyles.tabWrapper);
      tabInlineStyles.tabBar = _styleOverride2.default.merge(_TabStyles2.default.tabBar, this.props.tabsStyles.tabBar);
      tabInlineStyles.tabBarAfter = _styleOverride2.default.merge(_TabStyles2.default.tabBarAfter, this.props.tabsStyles.tabBarAfter);
      tabInlineStyles.tab = _styleOverride2.default.merge(_TabStyles2.default.tab, this.props.tabsStyles.tab);
      tabInlineStyles.tabBefore = _styleOverride2.default.merge(_TabStyles2.default.tabBefore, this.props.tabsStyles.tabBefore);
      tabInlineStyles.tabAfter = _styleOverride2.default.merge(_TabStyles2.default.tabAfter, this.props.tabsStyles.tabAfter);
      tabInlineStyles.tabTitle = _styleOverride2.default.merge(_TabStyles2.default.tabTitle, this.props.tabsStyles.tabTitle);
      tabInlineStyles.tabCloseIcon = _styleOverride2.default.merge(_TabStyles2.default.tabCloseIcon, this.props.tabsStyles.tabCloseIcon);
      tabInlineStyles.tabCloseIconOnHover = _styleOverride2.default.merge(_TabStyles2.default.tabCloseIconOnHover, this.props.tabsStyles.tabCloseIconOnHover);

      tabInlineStyles.tabActive = _styleOverride2.default.merge(_TabStyles2.default.tabActive, this.props.tabsStyles.tabActive);
      tabInlineStyles.tabTitleActive = _styleOverride2.default.merge(_TabStyles2.default.tabTitleActive, this.props.tabsStyles.tabTitleActive);
      tabInlineStyles.tabBeforeActive = _styleOverride2.default.merge(_TabStyles2.default.tabBeforeActive, this.props.tabsStyles.tabBeforeActive);
      tabInlineStyles.tabAfterActive = _styleOverride2.default.merge(_TabStyles2.default.tabAfterActive, this.props.tabsStyles.tabAfterActive);

      tabInlineStyles.tabOnHover = _styleOverride2.default.merge(_TabStyles2.default.tabOnHover, this.props.tabsStyles.tabOnHover);
      tabInlineStyles.tabTitleOnHover = _styleOverride2.default.merge(_TabStyles2.default.tabTitleOnHover, this.props.tabsStyles.tabTitleOnHover);
      tabInlineStyles.tabBeforeOnHover = _styleOverride2.default.merge(_TabStyles2.default.tabBeforeOnHover, this.props.tabsStyles.tabBeforeOnHover);
      tabInlineStyles.tabAfterOnHover = _styleOverride2.default.merge(_TabStyles2.default.tabAfterOnHover, this.props.tabsStyles.tabAfterOnHover);

      // append tabs classNames
      var _tabClassNames = {};
      _tabClassNames.tabWrapper = (0, _classnames2.default)('rdTabWrapper', this.props.tabsClassNames.tabWrapper);
      _tabClassNames.tabBar = (0, _classnames2.default)('rdTabBar', this.props.tabsClassNames.tabBar);
      _tabClassNames.tabBarAfter = (0, _classnames2.default)('rdTabBarAfter', this.props.tabsClassNames.tabBarAfter);
      _tabClassNames.tab = (0, _classnames2.default)('rdTab', this.props.tabsClassNames.tab);
      _tabClassNames.tabBefore = (0, _classnames2.default)('rdTabBefore', this.props.tabsClassNames.tabBefore);
      _tabClassNames.tabAfter = (0, _classnames2.default)('rdTabAfter', this.props.tabsClassNames.tabAfter);
      _tabClassNames.tabTitle = (0, _classnames2.default)('rdTabTitle', this.props.tabsClassNames.tabTitle);
      _tabClassNames.tabBeforeTitle = (0, _classnames2.default)('rdTabBeforeTitle', this.props.tabsClassNames.tabBeforeTitle);
      _tabClassNames.tabAfterTitle = (0, _classnames2.default)('rdTabAfterTitle', this.props.tabsClassNames.tabAfterTitle);
      _tabClassNames.tabCloseIcon = (0, _classnames2.default)('rdTabCloseIcon', this.props.tabsClassNames.tabCloseIcon);

      var content = [];
      var tabs = _lodash2.default.map(this.state.tabs, function (tab) {
        if (_this11.state.closedTabs.indexOf(tab.key) > -1) {
          return '';
        }
        var _tab$props = tab.props;
        var beforeTitle = _tab$props.beforeTitle;
        var title = _tab$props.title;
        var afterTitle = _tab$props.afterTitle;
        var disableClose = _tab$props.disableClose;
        var tabClassNames = _tab$props.tabClassNames;
        var tabStyles = _tab$props.tabStyles;
        var containerStyle = _tab$props.containerStyle;
        var onClick = _tab$props.onClick;
        var onMouseEnter = _tab$props.onMouseEnter;
        var onMouseLeave = _tab$props.onMouseLeave;

        var others = _objectWithoutProperties(_tab$props, ['beforeTitle', 'title', 'afterTitle', 'disableClose', 'tabClassNames', 'tabStyles', 'containerStyle', 'onClick', 'onMouseEnter', 'onMouseLeave']);

        // override inline each tab styles


        var tabStyle = _styleOverride2.default.merge(tabInlineStyles.tab, tabStyles.tab);
        var tabBeforeStyle = _styleOverride2.default.merge(tabInlineStyles.tabBefore, tabStyles.tabBefore);
        var tabAfterStyle = _styleOverride2.default.merge(tabInlineStyles.tabAfter, tabStyles.tabAfter);
        var tabTiteleStyle = _styleOverride2.default.merge(tabInlineStyles.tabTitle, tabStyles.tabTitle);
        var tabCloseIconStyle = _styleOverride2.default.merge(tabInlineStyles.tabCloseIcon, tabStyles.tabCloseIcon);

        var tabClasses = (0, _classnames2.default)(_tabClassNames.tab, tabClassNames.tab);
        var tabBeforeClasses = (0, _classnames2.default)(_tabClassNames.tabBefore, tabClassNames.tabBefore);
        var tabAfterClasses = (0, _classnames2.default)(_tabClassNames.tabAfter, tabClassNames.tabAfter);
        var tabTitleClasses = (0, _classnames2.default)(_tabClassNames.tabTitle, tabClassNames.tabTitle);
        var tabBeforeTitleClasses = (0, _classnames2.default)(_tabClassNames.tabBeforeTitle, tabClassNames.tabBeforeTitle);
        var tabAfterTitleClasses = (0, _classnames2.default)(_tabClassNames.tabAfterTitle, tabClassNames.tabAfterTitle);
        var tabCloseIconClasses = (0, _classnames2.default)(_tabClassNames.tabCloseIcon, tabClassNames.tabCloseIcon);

        if (_this11.state.selectedTab === tab.key) {
          tabStyle = _styleOverride2.default.merge(_styleOverride2.default.merge(tabInlineStyles.tab, tabInlineStyles.tabActive), tabStyles.tabActive);
          tabBeforeStyle = _styleOverride2.default.merge(_styleOverride2.default.merge(tabInlineStyles.tabBefore, tabInlineStyles.tabBeforeActive), tabStyles.tabBeforeActive);
          tabAfterStyle = _styleOverride2.default.merge(_styleOverride2.default.merge(tabInlineStyles.tabAfter, tabInlineStyles.tabAfterActive), tabStyles.tabAfterActive);
          tabTiteleStyle = _styleOverride2.default.merge(_styleOverride2.default.merge(tabInlineStyles.tabTitle, tabInlineStyles.tabTitleActive), tabStyles.tabTitleActive);
          tabClasses = (0, _classnames2.default)(tabClasses, 'rdTabActive', _this11.props.tabsClassNames.tabActive, tabClassNames.tabActive);
          content.push(_react2.default.createElement(
            _TabContainer2.default,
            { key: 'tabContainer#' + tab.key, selected: true, style: containerStyle },
            tab
          ));
        } else {
          if (_this11.state.hoveredTab === tab.key) {
            tabStyle = _styleOverride2.default.merge(_styleOverride2.default.merge(tabStyle, tabInlineStyles.tabOnHover), tabStyles.tabOnHover);
            tabBeforeStyle = _styleOverride2.default.merge(_styleOverride2.default.merge(tabBeforeStyle, tabInlineStyles.tabBeforeOnHover), tabStyles.tabBeforeOnHover);
            tabAfterStyle = _styleOverride2.default.merge(_styleOverride2.default.merge(tabAfterStyle, tabInlineStyles.tabAfterOnHover), tabStyles.tabAfterOnHover);
            tabTiteleStyle = _styleOverride2.default.merge(_styleOverride2.default.merge(tabTiteleStyle, tabInlineStyles.tabTitleOnHover), tabStyles.tabTitleOnHover);
            tabClasses = (0, _classnames2.default)(tabClasses, 'rdTabHover', _this11.props.tabsClassNames.tabHover, tabClassNames.tabHover);
          }
          content.push(_react2.default.createElement(
            _TabContainer2.default,
            { key: 'tabContainer#' + tab.key, selected: false, style: containerStyle },
            tab
          ));
        }

        // title will be shorten with inline style
        //  {
        //    overflow: 'hidden',
        //    whiteSpace: 'nowrap',
        //    textOverflow: 'ellipsis'
        //  }
        var extraAttribute = {};
        if (typeof title === 'string') {
          extraAttribute.title = title;
        }
        var closeButton = _this11.getCloseButton(tab, tabCloseIconStyle, tabCloseIconClasses, tabInlineStyles.tabCloseIconOnHover);

        return _react2.default.createElement(
          _CustomDraggable2.default,
          {
            key: 'draggable_tabs_' + tab.key,
            axis: 'x',
            cancel: '.rdTabCloseIcon',
            start: { x: 0, y: 0 },
            moveOnStartChange: true,
            zIndex: 100,
            bounds: 'parent',
            onStart: _this11.handleDragStart.bind(_this11, tab.key),
            onDrag: _this11.handleDrag.bind(_this11, tab.key),
            onStop: _this11.handleDragStop.bind(_this11, tab.key) },
          _react2.default.createElement(
            'li',
            _extends({ style: tabStyle, className: tabClasses,
              onClick: _this11.handleTabClick.bind(_this11, tab.key),
              onMouseEnter: _this11.handleMouseEnter.bind(_this11, tab.key, onMouseEnter),
              onMouseLeave: _this11.handleMouseLeave.bind(_this11, tab.key, onMouseLeave),
              ref: tab.key
            }, others),
            _react2.default.createElement(
              'span',
              { style: _TabStyles2.default.beforeTitle, className: tabBeforeTitleClasses },
              beforeTitle
            ),
            _react2.default.createElement(
              'p',
              _extends({ style: tabTiteleStyle,
                className: tabTitleClasses
              }, extraAttribute),
              title
            ),
            _react2.default.createElement(
              'span',
              { style: _TabStyles2.default.afterTitle, className: tabAfterTitleClasses },
              afterTitle
            ),
            closeButton,
            _react2.default.createElement('span', { style: tabBeforeStyle, className: tabBeforeClasses }),
            _react2.default.createElement('span', { style: tabAfterStyle, className: tabAfterClasses })
          )
        );
      });

      return _react2.default.createElement(
        'div',
        { style: tabInlineStyles.tabWrapper, className: _tabClassNames.tabWrapper },
        _react2.default.createElement(
          'ul',
          { tabIndex: '-1', style: tabInlineStyles.tabBar, className: _tabClassNames.tabBar },
          tabs,
          _react2.default.createElement(
            'li',
            { className: 'rdTabAddButton', style: _TabStyles2.default.tabAddButton, onClick: this.handleAddButtonClick.bind(this) },
            this.props.tabAddButton
          )
        ),
        _react2.default.createElement('span', { style: tabInlineStyles.tabBarAfter, className: _tabClassNames.tabBarAfter }),
        content
      );
    }
  }]);

  return Tabs;
}(_react2.default.Component);

Tabs.defaultProps = {
  tabsClassNames: {
    tabWrapper: '',
    tabBar: '',
    tabBarAfter: '',
    tab: '',
    tabBefore: '',
    tabAfter: '',
    tabBeforeTitle: '',
    tabTitle: '',
    tabAfterTitle: '',
    tabCloseIcon: '',
    tabActive: '',
    tabHover: ''
  },
  tabsStyles: {},
  shortCutKeys: {},
  tabAddButton: _react2.default.createElement(
    'span',
    null,
    '+'
  ),
  onTabSelect: function onTabSelect() {},
  onTabClose: function onTabClose() {},
  onTabAddButtonClick: function onTabAddButtonClick() {},
  onTabPositionChange: function onTabPositionChange() {},
  keepSelectedTab: false
};

Tabs.propTypes = {
  tabs: _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.element),

  selectedTab: _react2.default.PropTypes.string,
  tabsClassNames: _react2.default.PropTypes.shape({
    tabWrapper: _react2.default.PropTypes.string,
    tabBar: _react2.default.PropTypes.string,
    tabBarAfter: _react2.default.PropTypes.string,
    tab: _react2.default.PropTypes.string,
    tabBefore: _react2.default.PropTypes.string,
    tabAfter: _react2.default.PropTypes.string,
    tabBeforeTitle: _react2.default.PropTypes.string,
    tabTitle: _react2.default.PropTypes.string,
    tabAfterTitle: _react2.default.PropTypes.string,
    tabCloseIcon: _react2.default.PropTypes.string,
    tabActive: _react2.default.PropTypes.string,
    tabHover: _react2.default.PropTypes.string
  }),
  tabsStyles: _react2.default.PropTypes.shape({
    tabWrapper: _react2.default.PropTypes.object,
    tabBar: _react2.default.PropTypes.object,
    tabBarAfter: _react2.default.PropTypes.object,
    tab: _react2.default.PropTypes.object,
    tabBefore: _react2.default.PropTypes.object,
    tabAfter: _react2.default.PropTypes.object,
    tabTitle: _react2.default.PropTypes.object,
    tabActive: _react2.default.PropTypes.object,
    tabTitleActive: _react2.default.PropTypes.object,
    tabBeforeActive: _react2.default.PropTypes.object,
    tabAfterActive: _react2.default.PropTypes.object,
    tabOnHover: _react2.default.PropTypes.object,
    tabTitleOnHover: _react2.default.PropTypes.object,
    tabBeforeOnHover: _react2.default.PropTypes.object,
    tabAfterOnHover: _react2.default.PropTypes.object,
    tabCloseIcon: _react2.default.PropTypes.object,
    tabCloseIconOnHover: _react2.default.PropTypes.object
  }),
  shortCutKeys: _react2.default.PropTypes.shape({
    close: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)]),
    create: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)]),
    moveRight: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)]),
    moveLeft: _react2.default.PropTypes.oneOfType([_react2.default.PropTypes.string, _react2.default.PropTypes.arrayOf(_react2.default.PropTypes.string)])
  }),
  tabAddButton: _react2.default.PropTypes.element,
  onTabSelect: _react2.default.PropTypes.func,
  onTabClose: _react2.default.PropTypes.func,
  onTabAddButtonClick: _react2.default.PropTypes.func,
  onTabPositionChange: _react2.default.PropTypes.func,
  keepSelectedTab: _react2.default.PropTypes.bool
};

exports.default = Tabs;
