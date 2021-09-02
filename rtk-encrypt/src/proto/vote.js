/*eslint-disable block-scoped-var, id-length, no-control-regex, no-magic-numbers, no-prototype-builtins, no-redeclare, no-shadow, no-var, sort-vars*/
(function(global, factory) { /* global define, require, module */

    /* AMD */ if (typeof define === 'function' && define.amd)
        define(["protobufjs/minimal"], factory);

    /* CommonJS */ else if (typeof require === 'function' && typeof module === 'object' && module && module.exports)
        module.exports = factory(require("protobufjs/minimal"));

})(this, function($protobuf) {
    "use strict";

    var $Reader = $protobuf.Reader, $Writer = $protobuf.Writer, $util = $protobuf.util;
    
    var $root = $protobuf.roots["default"] || ($protobuf.roots["default"] = {});
    
    $root.RangeProof = (function() {
    
        function RangeProof(p) {
            this.As = [];
            this.Bs = [];
            this.c = [];
            this.r = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }
    
        RangeProof.prototype.A = $util.newBuffer([]);
        RangeProof.prototype.B = $util.newBuffer([]);
        RangeProof.prototype.As = $util.emptyArray;
        RangeProof.prototype.Bs = $util.emptyArray;
        RangeProof.prototype.c = $util.emptyArray;
        RangeProof.prototype.r = $util.emptyArray;
    
        RangeProof.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.A != null && Object.hasOwnProperty.call(m, "A"))
                w.uint32(10).bytes(m.A);
            if (m.B != null && Object.hasOwnProperty.call(m, "B"))
                w.uint32(18).bytes(m.B);
            if (m.As != null && m.As.length) {
                for (var i = 0; i < m.As.length; ++i)
                    w.uint32(26).bytes(m.As[i]);
            }
            if (m.Bs != null && m.Bs.length) {
                for (var i = 0; i < m.Bs.length; ++i)
                    w.uint32(34).bytes(m.Bs[i]);
            }
            if (m.c != null && m.c.length) {
                for (var i = 0; i < m.c.length; ++i)
                    w.uint32(42).bytes(m.c[i]);
            }
            if (m.r != null && m.r.length) {
                for (var i = 0; i < m.r.length; ++i)
                    w.uint32(50).bytes(m.r[i]);
            }
            return w;
        };
    
        RangeProof.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.RangeProof();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    m.A = r.bytes();
                    break;
                case 2:
                    m.B = r.bytes();
                    break;
                case 3:
                    if (!(m.As && m.As.length))
                        m.As = [];
                    m.As.push(r.bytes());
                    break;
                case 4:
                    if (!(m.Bs && m.Bs.length))
                        m.Bs = [];
                    m.Bs.push(r.bytes());
                    break;
                case 5:
                    if (!(m.c && m.c.length))
                        m.c = [];
                    m.c.push(r.bytes());
                    break;
                case 6:
                    if (!(m.r && m.r.length))
                        m.r = [];
                    m.r.push(r.bytes());
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };
    
        RangeProof.verify = function verify(m) {
            if (typeof m !== "object" || m === null)
                return "object expected";
            if (m.A != null && m.hasOwnProperty("A")) {
                if (!(m.A && typeof m.A.length === "number" || $util.isString(m.A)))
                    return "A: buffer expected";
            }
            if (m.B != null && m.hasOwnProperty("B")) {
                if (!(m.B && typeof m.B.length === "number" || $util.isString(m.B)))
                    return "B: buffer expected";
            }
            if (m.As != null && m.hasOwnProperty("As")) {
                if (!Array.isArray(m.As))
                    return "As: array expected";
                for (var i = 0; i < m.As.length; ++i) {
                    if (!(m.As[i] && typeof m.As[i].length === "number" || $util.isString(m.As[i])))
                        return "As: buffer[] expected";
                }
            }
            if (m.Bs != null && m.hasOwnProperty("Bs")) {
                if (!Array.isArray(m.Bs))
                    return "Bs: array expected";
                for (var i = 0; i < m.Bs.length; ++i) {
                    if (!(m.Bs[i] && typeof m.Bs[i].length === "number" || $util.isString(m.Bs[i])))
                        return "Bs: buffer[] expected";
                }
            }
            if (m.c != null && m.hasOwnProperty("c")) {
                if (!Array.isArray(m.c))
                    return "c: array expected";
                for (var i = 0; i < m.c.length; ++i) {
                    if (!(m.c[i] && typeof m.c[i].length === "number" || $util.isString(m.c[i])))
                        return "c: buffer[] expected";
                }
            }
            if (m.r != null && m.hasOwnProperty("r")) {
                if (!Array.isArray(m.r))
                    return "r: array expected";
                for (var i = 0; i < m.r.length; ++i) {
                    if (!(m.r[i] && typeof m.r[i].length === "number" || $util.isString(m.r[i])))
                        return "r: buffer[] expected";
                }
            }
            return null;
        };
    
        RangeProof.fromObject = function fromObject(d) {
            if (d instanceof $root.RangeProof)
                return d;
            var m = new $root.RangeProof();
            if (d.A != null) {
                if (typeof d.A === "string")
                    $util.base64.decode(d.A, m.A = $util.newBuffer($util.base64.length(d.A)), 0);
                else if (d.A.length)
                    m.A = d.A;
            }
            if (d.B != null) {
                if (typeof d.B === "string")
                    $util.base64.decode(d.B, m.B = $util.newBuffer($util.base64.length(d.B)), 0);
                else if (d.B.length)
                    m.B = d.B;
            }
            if (d.As) {
                if (!Array.isArray(d.As))
                    throw TypeError(".RangeProof.As: array expected");
                m.As = [];
                for (var i = 0; i < d.As.length; ++i) {
                    if (typeof d.As[i] === "string")
                        $util.base64.decode(d.As[i], m.As[i] = $util.newBuffer($util.base64.length(d.As[i])), 0);
                    else if (d.As[i].length)
                        m.As[i] = d.As[i];
                }
            }
            if (d.Bs) {
                if (!Array.isArray(d.Bs))
                    throw TypeError(".RangeProof.Bs: array expected");
                m.Bs = [];
                for (var i = 0; i < d.Bs.length; ++i) {
                    if (typeof d.Bs[i] === "string")
                        $util.base64.decode(d.Bs[i], m.Bs[i] = $util.newBuffer($util.base64.length(d.Bs[i])), 0);
                    else if (d.Bs[i].length)
                        m.Bs[i] = d.Bs[i];
                }
            }
            if (d.c) {
                if (!Array.isArray(d.c))
                    throw TypeError(".RangeProof.c: array expected");
                m.c = [];
                for (var i = 0; i < d.c.length; ++i) {
                    if (typeof d.c[i] === "string")
                        $util.base64.decode(d.c[i], m.c[i] = $util.newBuffer($util.base64.length(d.c[i])), 0);
                    else if (d.c[i].length)
                        m.c[i] = d.c[i];
                }
            }
            if (d.r) {
                if (!Array.isArray(d.r))
                    throw TypeError(".RangeProof.r: array expected");
                m.r = [];
                for (var i = 0; i < d.r.length; ++i) {
                    if (typeof d.r[i] === "string")
                        $util.base64.decode(d.r[i], m.r[i] = $util.newBuffer($util.base64.length(d.r[i])), 0);
                    else if (d.r[i].length)
                        m.r[i] = d.r[i];
                }
            }
            return m;
        };
    
        RangeProof.toObject = function toObject(m, o) {
            if (!o)
                o = {};
            var d = {};
            if (o.arrays || o.defaults) {
                d.As = [];
                d.Bs = [];
                d.c = [];
                d.r = [];
            }
            if (o.defaults) {
                if (o.bytes === String)
                    d.A = "";
                else {
                    d.A = [];
                    if (o.bytes !== Array)
                        d.A = $util.newBuffer(d.A);
                }
                if (o.bytes === String)
                    d.B = "";
                else {
                    d.B = [];
                    if (o.bytes !== Array)
                        d.B = $util.newBuffer(d.B);
                }
            }
            if (m.A != null && m.hasOwnProperty("A")) {
                d.A = o.bytes === String ? $util.base64.encode(m.A, 0, m.A.length) : o.bytes === Array ? Array.prototype.slice.call(m.A) : m.A;
            }
            if (m.B != null && m.hasOwnProperty("B")) {
                d.B = o.bytes === String ? $util.base64.encode(m.B, 0, m.B.length) : o.bytes === Array ? Array.prototype.slice.call(m.B) : m.B;
            }
            if (m.As && m.As.length) {
                d.As = [];
                for (var j = 0; j < m.As.length; ++j) {
                    d.As[j] = o.bytes === String ? $util.base64.encode(m.As[j], 0, m.As[j].length) : o.bytes === Array ? Array.prototype.slice.call(m.As[j]) : m.As[j];
                }
            }
            if (m.Bs && m.Bs.length) {
                d.Bs = [];
                for (var j = 0; j < m.Bs.length; ++j) {
                    d.Bs[j] = o.bytes === String ? $util.base64.encode(m.Bs[j], 0, m.Bs[j].length) : o.bytes === Array ? Array.prototype.slice.call(m.Bs[j]) : m.Bs[j];
                }
            }
            if (m.c && m.c.length) {
                d.c = [];
                for (var j = 0; j < m.c.length; ++j) {
                    d.c[j] = o.bytes === String ? $util.base64.encode(m.c[j], 0, m.c[j].length) : o.bytes === Array ? Array.prototype.slice.call(m.c[j]) : m.c[j];
                }
            }
            if (m.r && m.r.length) {
                d.r = [];
                for (var j = 0; j < m.r.length; ++j) {
                    d.r[j] = o.bytes === String ? $util.base64.encode(m.r[j], 0, m.r[j].length) : o.bytes === Array ? Array.prototype.slice.call(m.r[j]) : m.r[j];
                }
            }
            return d;
        };
    
        RangeProof.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return RangeProof;
    })();
    
    $root.Question = (function() {
    
        function Question(p) {
            this.options = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }
    
        Question.prototype.options = $util.emptyArray;
        Question.prototype.sum = null;
    
        Question.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.options != null && m.options.length) {
                for (var i = 0; i < m.options.length; ++i)
                    $root.RangeProof.encode(m.options[i], w.uint32(10).fork()).ldelim();
            }
            if (m.sum != null && Object.hasOwnProperty.call(m, "sum"))
                $root.RangeProof.encode(m.sum, w.uint32(18).fork()).ldelim();
            return w;
        };
    
        Question.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.Question();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    if (!(m.options && m.options.length))
                        m.options = [];
                    m.options.push($root.RangeProof.decode(r, r.uint32()));
                    break;
                case 2:
                    m.sum = $root.RangeProof.decode(r, r.uint32());
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };
    
        Question.verify = function verify(m) {
            if (typeof m !== "object" || m === null)
                return "object expected";
            if (m.options != null && m.hasOwnProperty("options")) {
                if (!Array.isArray(m.options))
                    return "options: array expected";
                for (var i = 0; i < m.options.length; ++i) {
                    {
                        var e = $root.RangeProof.verify(m.options[i]);
                        if (e)
                            return "options." + e;
                    }
                }
            }
            if (m.sum != null && m.hasOwnProperty("sum")) {
                {
                    var e = $root.RangeProof.verify(m.sum);
                    if (e)
                        return "sum." + e;
                }
            }
            return null;
        };
    
        Question.fromObject = function fromObject(d) {
            if (d instanceof $root.Question)
                return d;
            var m = new $root.Question();
            if (d.options) {
                if (!Array.isArray(d.options))
                    throw TypeError(".Question.options: array expected");
                m.options = [];
                for (var i = 0; i < d.options.length; ++i) {
                    if (typeof d.options[i] !== "object")
                        throw TypeError(".Question.options: object expected");
                    m.options[i] = $root.RangeProof.fromObject(d.options[i]);
                }
            }
            if (d.sum != null) {
                if (typeof d.sum !== "object")
                    throw TypeError(".Question.sum: object expected");
                m.sum = $root.RangeProof.fromObject(d.sum);
            }
            return m;
        };
    
        Question.toObject = function toObject(m, o) {
            if (!o)
                o = {};
            var d = {};
            if (o.arrays || o.defaults) {
                d.options = [];
            }
            if (o.defaults) {
                d.sum = null;
            }
            if (m.options && m.options.length) {
                d.options = [];
                for (var j = 0; j < m.options.length; ++j) {
                    d.options[j] = $root.RangeProof.toObject(m.options[j], o);
                }
            }
            if (m.sum != null && m.hasOwnProperty("sum")) {
                d.sum = $root.RangeProof.toObject(m.sum, o);
            }
            return d;
        };
    
        Question.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return Question;
    })();
    
    $root.Bulletin = (function() {
    
        function Bulletin(p) {
            this.questions = [];
            if (p)
                for (var ks = Object.keys(p), i = 0; i < ks.length; ++i)
                    if (p[ks[i]] != null)
                        this[ks[i]] = p[ks[i]];
        }
    
        Bulletin.prototype.questions = $util.emptyArray;
    
        Bulletin.encode = function encode(m, w) {
            if (!w)
                w = $Writer.create();
            if (m.questions != null && m.questions.length) {
                for (var i = 0; i < m.questions.length; ++i)
                    $root.Question.encode(m.questions[i], w.uint32(10).fork()).ldelim();
            }
            return w;
        };
    
        Bulletin.decode = function decode(r, l) {
            if (!(r instanceof $Reader))
                r = $Reader.create(r);
            var c = l === undefined ? r.len : r.pos + l, m = new $root.Bulletin();
            while (r.pos < c) {
                var t = r.uint32();
                switch (t >>> 3) {
                case 1:
                    if (!(m.questions && m.questions.length))
                        m.questions = [];
                    m.questions.push($root.Question.decode(r, r.uint32()));
                    break;
                default:
                    r.skipType(t & 7);
                    break;
                }
            }
            return m;
        };
    
        Bulletin.verify = function verify(m) {
            if (typeof m !== "object" || m === null)
                return "object expected";
            if (m.questions != null && m.hasOwnProperty("questions")) {
                if (!Array.isArray(m.questions))
                    return "questions: array expected";
                for (var i = 0; i < m.questions.length; ++i) {
                    {
                        var e = $root.Question.verify(m.questions[i]);
                        if (e)
                            return "questions." + e;
                    }
                }
            }
            return null;
        };
    
        Bulletin.fromObject = function fromObject(d) {
            if (d instanceof $root.Bulletin)
                return d;
            var m = new $root.Bulletin();
            if (d.questions) {
                if (!Array.isArray(d.questions))
                    throw TypeError(".Bulletin.questions: array expected");
                m.questions = [];
                for (var i = 0; i < d.questions.length; ++i) {
                    if (typeof d.questions[i] !== "object")
                        throw TypeError(".Bulletin.questions: object expected");
                    m.questions[i] = $root.Question.fromObject(d.questions[i]);
                }
            }
            return m;
        };
    
        Bulletin.toObject = function toObject(m, o) {
            if (!o)
                o = {};
            var d = {};
            if (o.arrays || o.defaults) {
                d.questions = [];
            }
            if (m.questions && m.questions.length) {
                d.questions = [];
                for (var j = 0; j < m.questions.length; ++j) {
                    d.questions[j] = $root.Question.toObject(m.questions[j], o);
                }
            }
            return d;
        };
    
        Bulletin.prototype.toJSON = function toJSON() {
            return this.constructor.toObject(this, $protobuf.util.toJSONOptions);
        };
    
        return Bulletin;
    })();

    return $root;
});
