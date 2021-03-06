(function(){
	var c = (typeof process !== "undefined" && process.versions && process.versions.node);
	var a = !c && (typeof window !== "undefined" || typeof self !== "undefined");
	if (a) {
		if (typeof global === "undefined") {
			if (typeof window !== "undefined") {
				global = window
			} else {
				if (typeof self !== "undefined") {
					global = self
				} else {
					if (typeof $ !== "undefined") {
						global = $
					}
				}
			}
		}
	}
	var d = function(I){
		I.compact = function(aT, e, aU, aX){
			if (arguments.length < 2) {
				return I.nextTick(function(){
					aX(new TypeError("Could not compact, too few arguments."))
				})
			}
			if (typeof aU === "function") {
				aX = aU;
				aU = {}
			}
			aU = aU || {};
			if (e === null) {
				return I.nextTick(function(){
					aX(new x("The compaction context must not be null.", "jsonld.CompactError", {code: "invalid local context"}))
				})
			}
			if (aT === null) {
				return I.nextTick(function(){
					aX(null, null)
				})
			}
			if (!("base" in aU)) {
				aU.base = (typeof aT === "string") ? aT : ""
			}
			if (!("compactArrays" in aU)) {
				aU.compactArrays = true
			}
			if (!("graph" in aU)) {
				aU.graph = false
			}
			if (!("skipExpansion" in aU)) {
				aU.skipExpansion = false
			}
			if (!("documentLoader" in aU)) {
				aU.documentLoader = I.loadDocument
			}
			if (!("link" in aU)) {
				aU.link = false
			}
			if (aU.link) {
				aU.skipExpansion = true
			}
			var aW = function(aY, aZ, a0){
				I.nextTick(function(){
					if (aZ.skipExpansion) {
						return a0(null, aY)
					}
					I.expand(aY, aZ, a0)
				})
			};
			aW(aT, aU, function(aZ, aY){
				if (aZ) {
					return aX(new x("Could not expand input before compaction.", "jsonld.CompactError", {cause: aZ}))
				}
				var a0 = A(aU);
				I.processContext(a0, e, aU, function(a3, a4){
					if (a3) {
						return aX(new x("Could not process context before compaction.", "jsonld.CompactError", {cause: a3}))
					}
					var a1;
					try {
						a1 = new m().compact(a4, null, aY, aU)
					} catch (a2) {
						return aX(a2)
					}
					aV(null, a1, a4, aU)
				})
			});
			function aV(aY, a6, a3, a7){
				if (aY) {
					return aX(aY)
				}
				if (a7.compactArrays && !a7.graph && K(a6)) {
					if (a6.length === 1) {
						a6 = a6[0]
					} else {
						if (a6.length === 0) {
							a6 = {}
						}
					}
				} else {
					if (a7.graph && aD(a6)) {
						a6 = [a6]
					}
				}
				if (aD(e) && "@context" in e) {
					e = e["@context"]
				}
				e = o(e);
				if (!K(e)) {
					e = [e]
				}
				var a0 = e;
				e = [];
				for (var a1 = 0; a1 < a0.length; ++a1){
					if (!aD(a0[a1]) || Object.keys(a0[a1]).length > 0) {
						e.push(a0[a1])
					}
				}
				var a2 = (e.length > 0);
				if (e.length === 1) {
					e = e[0]
				}
				if (K(a6)) {
					var aZ = aI(a3, "@graph");
					var a5 = a6;
					a6 = {};
					if (a2) {
						a6["@context"] = e
					}
					a6[aZ] = a5
				} else {
					if (aD(a6) && a2) {
						var a5 = a6;
						a6 = {"@context": e};
						for (var a4 in a5){
							a6[a4] = a5[a4]
						}
					}
				}
				aX(null, a6, a3)
			}
		};
		I.expand = function(e, aT, aV){
			if (arguments.length < 1) {
				return I.nextTick(function(){
					aV(new TypeError("Could not expand, too few arguments."))
				})
			}
			if (typeof aT === "function") {
				aV = aT;
				aT = {}
			}
			aT = aT || {};
			if (!("documentLoader" in aT)) {
				aT.documentLoader = I.loadDocument
			}
			if (!("keepFreeFloatingNodes" in aT)) {
				aT.keepFreeFloatingNodes = false
			}
			I.nextTick(function(){
				if (typeof e === "string") {
					var aW = function(aZ, a0){
						if (aZ) {
							return aV(aZ)
						}
						try {
							if (!a0.document) {
								throw new x("No remote document found at the given URL.", "jsonld.NullRemoteDocument")
							}
							if (typeof a0.document === "string") {
								a0.document = JSON.parse(a0.document)
							}
						} catch (aY) {
							return aV(new x("Could not retrieve a JSON-LD document from the URL. URL dereferencing not implemented.", "jsonld.LoadDocumentError", {
								code: "loading document failed",
								cause: aY,
								remoteDoc: a0
							}))
						}
						aU(a0)
					};
					var aX = aT.documentLoader(e, aW);
					if (aX && "then" in aX) {
						aX.then(aW.bind(null, null), aW)
					}
					return
				}
				aU({contextUrl: null, documentUrl: null, document: e})
			});
			function aU(aY){
				if (!("base" in aT)) {
					aT.base = aY.documentUrl || ""
				}
				var aW = {document: o(aY.document), remoteContext: {"@context": aY.contextUrl}};
				if ("expandContext" in aT) {
					var aX = o(aT.expandContext);
					if (typeof aX === "object" && "@context" in aX) {
						aW.expandContext = aX
					} else {
						aW.expandContext = {"@context": aX}
					}
				}
				aM(aW, aT, function(a5, a2){
					if (a5) {
						return aV(a5)
					}
					var a1;
					try {
						var a4 = new m();
						var a6 = A(aT);
						var aZ = a2.document;
						var a0 = a2.remoteContext["@context"];
						if (a2.expandContext) {
							a6 = a4.processContext(a6, a2.expandContext["@context"], aT)
						}
						if (a0) {
							a6 = a4.processContext(a6, a0, aT)
						}
						a1 = a4.expand(a6, null, aZ, aT, false);
						if (aD(a1) && ("@graph" in a1) && Object.keys(a1).length === 1) {
							a1 = a1["@graph"]
						} else {
							if (a1 === null) {
								a1 = []
							}
						}
						if (!K(a1)) {
							a1 = [a1]
						}
					} catch (a3) {
						return aV(a3)
					}
					aV(null, a1)
				})
			}
		};
		I.flatten = function(aT, e, aU, aV){
			if (arguments.length < 1) {
				return I.nextTick(function(){
					aV(new TypeError("Could not flatten, too few arguments."))
				})
			}
			if (typeof aU === "function") {
				aV = aU;
				aU = {}
			} else {
				if (typeof e === "function") {
					aV = e;
					e = null;
					aU = {}
				}
			}
			aU = aU || {};
			if (!("base" in aU)) {
				aU.base = (typeof aT === "string") ? aT : ""
			}
			if (!("documentLoader" in aU)) {
				aU.documentLoader = I.loadDocument
			}
			I.expand(aT, aU, function(aY, aZ){
				if (aY) {
					return aV(new x("Could not expand input before flattening.", "jsonld.FlattenError", {cause: aY}))
				}
				var aX;
				try {
					aX = new m().flatten(aZ)
				} catch (aW) {
					return aV(aW)
				}
				if (e === null) {
					return aV(null, aX)
				}
				aU.graph = true;
				aU.skipExpansion = true;
				I.compact(aX, e, aU, function(a1, a0){
					if (a1) {
						return aV(new x("Could not compact flattened output.", "jsonld.FlattenError", {cause: a1}))
					}
					aV(null, a0)
				})
			})
		};
		I.frame = function(aT, aV, aU, aW){
			if (arguments.length < 2) {
				return I.nextTick(function(){
					aW(new TypeError("Could not frame, too few arguments."))
				})
			}
			if (typeof aU === "function") {
				aW = aU;
				aU = {}
			}
			aU = aU || {};
			if (!("base" in aU)) {
				aU.base = (typeof aT === "string") ? aT : ""
			}
			if (!("documentLoader" in aU)) {
				aU.documentLoader = I.loadDocument
			}
			if (!("embed" in aU)) {
				aU.embed = "@last"
			}
			aU.explicit = aU.explicit || false;
			if (!("requireAll" in aU)) {
				aU.requireAll = true
			}
			aU.omitDefault = aU.omitDefault || false;
			I.nextTick(function(){
				if (typeof aV === "string") {
					var aX = function(a0, a1){
						if (a0) {
							return aW(a0)
						}
						try {
							if (!a1.document) {
								throw new x("No remote document found at the given URL.", "jsonld.NullRemoteDocument")
							}
							if (typeof a1.document === "string") {
								a1.document = JSON.parse(a1.document)
							}
						} catch (aZ) {
							return aW(new x("Could not retrieve a JSON-LD document from the URL. URL dereferencing not implemented.", "jsonld.LoadDocumentError", {
								code: "loading document failed",
								cause: aZ,
								remoteDoc: a1
							}))
						}
						e(a1)
					};
					var aY = aU.documentLoader(aV, aX);
					if (aY && "then" in aY) {
						aY.then(aX.bind(null, null), aX)
					}
					return
				}
				e({contextUrl: null, documentUrl: null, document: aV})
			});
			function e(aY){
				var aZ = aY.document;
				var aX;
				if (aZ) {
					aX = aZ["@context"];
					if (aY.contextUrl) {
						if (!aX) {
							aX = aY.contextUrl
						} else {
							if (K(aX)) {
								aX.push(aY.contextUrl)
							} else {
								aX = [aX, aY.contextUrl]
							}
						}
						aZ["@context"] = aX
					} else {
						aX = aX || {}
					}
				} else {
					aX = {}
				}
				I.expand(aT, aU, function(a2, a0){
					if (a2) {
						return aW(new x("Could not expand input before framing.", "jsonld.FrameError", {cause: a2}))
					}
					var a1 = o(aU);
					a1.isFrame = true;
					a1.keepFreeFloatingNodes = true;
					I.expand(aZ, a1, function(a5, a6){
						if (a5) {
							return aW(new x("Could not expand frame before framing.", "jsonld.FrameError", {cause: a5}))
						}
						var a3;
						try {
							a3 = new m().frame(a0, a6, a1)
						} catch (a4) {
							return aW(a4)
						}
						a1.graph = true;
						a1.skipExpansion = true;
						a1.link = {};
						I.compact(a3, aX, a1, function(a9, a7, a8){
							if (a9) {
								return aW(new x("Could not compact framed output.", "jsonld.FrameError", {cause: a9}))
							}
							var ba = aI(a8, "@graph");
							a1.link = {};
							a7[ba] = w(a8, a7[ba], a1);
							aW(null, a7)
						})
					})
				})
			}
		};
		I.link = function(aT, e, aU, aW){
			var aV = {};
			if (e) {
				aV["@context"] = e
			}
			aV["@embed"] = "@link";
			I.frame(aT, aV, aU, aW)
		};
		I.objectify = function(aT, e, aU, aV){
			if (typeof aU === "function") {
				aV = aU;
				aU = {}
			}
			aU = aU || {};
			if (!("base" in aU)) {
				aU.base = (typeof aT === "string") ? aT : ""
			}
			if (!("documentLoader" in aU)) {
				aU.documentLoader = I.loadDocument
			}
			I.expand(aT, aU, function(aY, aZ){
				if (aY) {
					return aV(new x("Could not expand input before linking.", "jsonld.LinkError", {cause: aY}))
				}
				var aX;
				try {
					aX = new m().flatten(aZ)
				} catch (aW) {
					return aV(aW)
				}
				aU.graph = true;
				aU.skipExpansion = true;
				I.compact(aX, e, aU, function(a1, a5, a7){
					if (a1) {
						return aV(new x("Could not compact flattened output before linking.", "jsonld.LinkError", {cause: a1}))
					}
					var a4 = aI(a7, "@graph");
					var a3 = a5[a4][0];
					var a0 = function(bc){
						if (!aD(bc) && !K(bc)) {
							return
						}
						if (aD(bc)) {
							if (a0.visited[bc["@id"]]) {
								return
							}
							a0.visited[bc["@id"]] = true
						}
						for (var ba in bc){
							var be = bc[ba];
							var bd = (I.getContextValue(a7, ba, "@type") === "@id");
							if (!K(be) && !aD(be) && !bd) {
								continue
							}
							if (aa(be) && bd) {
								bc[ba] = be = a3[be];
								a0(be)
							} else {
								if (K(be)) {
									for (var bb = 0; bb < be.length; ++bb){
										if (aa(be[bb]) && bd) {
											be[bb] = a3[be[bb]]
										} else {
											if (aD(be[bb]) && "@id" in be[bb]) {
												be[bb] = a3[be[bb]["@id"]]
											}
										}
										a0(be[bb])
									}
								} else {
									if (aD(be)) {
										var a9 = be["@id"];
										bc[ba] = be = a3[a9];
										a0(be)
									}
								}
							}
						}
					};
					a0.visited = {};
					a0(a3);
					a5.of_type = {};
					for (var a8 in a3){
						if (!("@type" in a3[a8])) {
							continue
						}
						var a2 = a3[a8]["@type"];
						if (!K(a2)) {
							a2 = [a2]
						}
						for (var a6 = 0; a6 < a2.length; ++a6){
							if (!(a2[a6] in a5.of_type)) {
								a5.of_type[a2[a6]] = []
							}
							a5.of_type[a2[a6]].push(a3[a8])
						}
					}
					aV(null, a5)
				})
			})
		};
		I.normalize = function(e, aT, aV){
			if (arguments.length < 1) {
				return I.nextTick(function(){
					aV(new TypeError("Could not normalize, too few arguments."))
				})
			}
			if (typeof aT === "function") {
				aV = aT;
				aT = {}
			}
			aT = aT || {};
			if (!("base" in aT)) {
				aT.base = (typeof e === "string") ? e : ""
			}
			if (!("documentLoader" in aT)) {
				aT.documentLoader = I.loadDocument
			}
			var aU = o(aT);
			delete aU.format;
			aU.produceGeneralizedRdf = false;
			I.toRDF(e, aU, function(aW, aX){
				if (aW) {
					return aV(new x("Could not convert input to RDF dataset before normalization.", "jsonld.NormalizeError", {cause: aW}))
				}
				new m().normalize(aX, aT, aV)
			})
		};
		I.fromRDF = function(aT, e, aU){
			if (arguments.length < 1) {
				return I.nextTick(function(){
					aU(new TypeError("Could not convert from RDF, too few arguments."))
				})
			}
			if (typeof e === "function") {
				aU = e;
				e = {}
			}
			e = e || {};
			if (!("useRdfType" in e)) {
				e.useRdfType = false
			}
			if (!("useNativeTypes" in e)) {
				e.useNativeTypes = false
			}
			if (!("format" in e) && aa(aT)) {
				if (!("format" in e)) {
					e.format = "application/nquads"
				}
			}
			I.nextTick(function(){
				var aV;
				if (e.format) {
					aV = e.rdfParser || S[e.format];
					if (!aV) {
						return aU(new x("Unknown input format.", "jsonld.UnknownFormat", {format: e.format}))
					}
				} else {
					aV = function(){
						return aT
					}
				}
				var aY = false;
				try {
					aT = aV(aT, function(aZ, a0){
						aY = true;
						if (aZ) {
							return aU(aZ)
						}
						aX(a0, e, aU)
					})
				} catch (aW) {
					if (!aY) {
						return aU(aW)
					}
					throw aW
				}
				if (aT) {
					if ("then" in aT) {
						return aT.then(function(aZ){
							aX(aZ, e, aU)
						}, aU)
					}
					aX(aT, e, aU)
				}
				function aX(a0, aZ, a1){
					new m().fromRDF(a0, aZ, a1)
				}
			})
		};
		I.toRDF = function(e, aT, aU){
			if (arguments.length < 1) {
				return I.nextTick(function(){
					aU(new TypeError("Could not convert to RDF, too few arguments."))
				})
			}
			if (typeof aT === "function") {
				aU = aT;
				aT = {}
			}
			aT = aT || {};
			if (!("base" in aT)) {
				aT.base = (typeof e === "string") ? e : ""
			}
			if (!("documentLoader" in aT)) {
				aT.documentLoader = I.loadDocument
			}
			I.expand(e, aT, function(aX, aV){
				if (aX) {
					return aU(new x("Could not expand input before serialization to RDF.", "jsonld.RdfError", {cause: aX}))
				}
				var aY;
				try {
					aY = m.prototype.toRDF(aV, aT);
					if (aT.format) {
						if (aT.format === "application/nquads") {
							return aU(null, aL(aY))
						}
						throw new x("Unknown output format.", "jsonld.UnknownFormat", {format: aT.format})
					}
				} catch (aW) {
					return aU(aW)
				}
				aU(null, aY)
			})
		};
		I.createNodeMap = function(e, aT, aU){
			if (arguments.length < 1) {
				return I.nextTick(function(){
					aU(new TypeError("Could not create node map, too few arguments."))
				})
			}
			if (typeof aT === "function") {
				aU = aT;
				aT = {}
			}
			aT = aT || {};
			if (!("base" in aT)) {
				aT.base = (typeof e === "string") ? e : ""
			}
			if (!("documentLoader" in aT)) {
				aT.documentLoader = I.loadDocument
			}
			I.expand(e, aT, function(aW, aY){
				if (aW) {
					return aU(new x("Could not expand input before creating node map.", "jsonld.CreateNodeMapError", {cause: aW}))
				}
				var aX;
				try {
					aX = new m().createNodeMap(aY, aT)
				} catch (aV) {
					return aU(aV)
				}
				aU(null, aX)
			})
		};
		I.merge = function(aW, a1, a3, a0){
			if (arguments.length < 1) {
				return I.nextTick(function(){
					a0(new TypeError("Could not merge, too few arguments."))
				})
			}
			if (!K(aW)) {
				return I.nextTick(function(){
					a0(new TypeError('Could not merge, "docs" must be an array.'))
				})
			}
			if (typeof a3 === "function") {
				a0 = a3;
				a3 = {}
			} else {
				if (typeof a1 === "function") {
					a0 = a1;
					a1 = null;
					a3 = {}
				}
			}
			a3 = a3 || {};
			var aV = [];
			var aX = null;
			var aU = aW.length;
			for (var aT = 0; aT < aW.length; ++aT){
				var e = {};
				for (var aZ in a3){
					e[aZ] = a3[aZ]
				}
				I.expand(aW[aT], e, a2)
			}
			function a2(a4, a5){
				if (aX) {
					return
				}
				if (a4) {
					aX = a4;
					return a0(new x("Could not expand input before flattening.", "jsonld.FlattenError", {cause: a4}))
				}
				aV.push(a5);
				if (--aU === 0) {
					aY(aV)
				}
			}
			
			function aY(a9){
				var be = true;
				if ("mergeNodes" in a3) {
					be = a3.mergeNodes
				}
				var bd = a3.namer || new j("_:b");
				var ba = {"@default": {}};
				var bf;
				try {
					for (var a7 = 0; a7 < a9.length; ++a7){
						var bg = a9[a7];
						bg = I.relabelBlankNodes(bg, {namer: new j("_:b" + a7 + "-")});
						var a4 = (be || a7 === 0) ? ba : {"@default": {}};
						ae(bg, a4, "@default", bd);
						if (a4 !== ba) {
							for (var a8 in a4){
								var bi = a4[a8];
								if (!(a8 in ba)) {
									ba[a8] = bi;
									continue
								}
								var bc = ba[a8];
								for (var bh in bi){
									if (!(bh in bc)) {
										bc[bh] = bi[bh]
									}
								}
							}
						}
					}
					bf = ah(ba)
				} catch (bb) {
					return a0(bb)
				}
				var bk = [];
				var bj = Object.keys(bf).sort();
				for (var a5 = 0; a5 < bj.length; ++a5){
					var a6 = bf[bj[a5]];
					if (!ax(a6)) {
						bk.push(a6)
					}
				}
				if (a1 === null) {
					return a0(null, bk)
				}
				a3.graph = true;
				a3.skipExpansion = true;
				I.compact(bk, a1, a3, function(bm, bl){
					if (bm) {
						return a0(new x("Could not compact merged output.", "jsonld.MergeError", {cause: bm}))
					}
					a0(null, bl)
				})
			}
		};
		I.relabelBlankNodes = function(e, aT){
			aT = aT || {};
			var aU = aT.namer || new j("_:b");
			return X(aU, e)
		};
		I.documentLoader = function(e, aU){
			var aT = new x("Could not retrieve a JSON-LD document from the URL. URL dereferencing not implemented.", "jsonld.LoadDocumentError", {code: "loading document failed"});
			if (c) {
				return aU(aT, {contextUrl: null, documentUrl: e, document: null})
			}
			return I.promisify(function(aV){
				aV(aT)
			})
		};
		I.loadDocument = function(e, aU){
			var aT = I.documentLoader(e, aU);
			if (aT && "then" in aT) {
				aT.then(aU.bind(null, null), aU)
			}
		};
		I.promises = function(aV){
			aV = aV || {};
			var aZ = Array.prototype.slice;
			var aU = I.promisify;
			var aW = aV.api || {};
			var aT = aV.version || "jsonld.js";
			if (typeof aV.api === "string") {
				if (!aV.version) {
					aT = aV.api
				}
				aW = {}
			}
			aW.expand = function(e){
				if (arguments.length < 1) {
					throw new TypeError("Could not expand, too few arguments.")
				}
				return aU.apply(null, [I.expand].concat(aZ.call(arguments)))
			};
			aW.compact = function(a1, e){
				if (arguments.length < 2) {
					throw new TypeError("Could not compact, too few arguments.")
				}
				var a2 = function(a4, a3, a5, a6){
					I.compact(a4, a3, a5, function(a8, a7){
						a6(a8, a7)
					})
				};
				return aU.apply(null, [a2].concat(aZ.call(arguments)))
			};
			aW.flatten = function(e){
				if (arguments.length < 1) {
					throw new TypeError("Could not flatten, too few arguments.")
				}
				return aU.apply(null, [I.flatten].concat(aZ.call(arguments)))
			};
			aW.frame = function(e, a1){
				if (arguments.length < 2) {
					throw new TypeError("Could not frame, too few arguments.")
				}
				return aU.apply(null, [I.frame].concat(aZ.call(arguments)))
			};
			aW.fromRDF = function(e){
				if (arguments.length < 1) {
					throw new TypeError("Could not convert from RDF, too few arguments.")
				}
				return aU.apply(null, [I.fromRDF].concat(aZ.call(arguments)))
			};
			aW.toRDF = function(e){
				if (arguments.length < 1) {
					throw new TypeError("Could not convert to RDF, too few arguments.")
				}
				return aU.apply(null, [I.toRDF].concat(aZ.call(arguments)))
			};
			aW.normalize = function(e){
				if (arguments.length < 1) {
					throw new TypeError("Could not normalize, too few arguments.")
				}
				return aU.apply(null, [I.normalize].concat(aZ.call(arguments)))
			};
			if (aT === "jsonld.js") {
				aW.link = function(a1, e){
					if (arguments.length < 2) {
						throw new TypeError("Could not link, too few arguments.")
					}
					return aU.apply(null, [I.link].concat(aZ.call(arguments)))
				};
				aW.objectify = function(e){
					return aU.apply(null, [I.objectify].concat(aZ.call(arguments)))
				};
				aW.createNodeMap = function(e){
					return aU.apply(null, [I.createNodeMap].concat(aZ.call(arguments)))
				};
				aW.merge = function(e){
					return aU.apply(null, [I.merge].concat(aZ.call(arguments)))
				}
			}
			try {
				I.Promise = global.Promise || require("es6-promise").Promise
			} catch (aY) {
				var aX = function(){
					throw new Error("Unable to find a Promise implementation.")
				};
				for (var a0 in aW){
					aW[a0] = aX
				}
			}
			return aW
		};
		I.promisify = function(aV){
			if (!I.Promise) {
				try {
					I.Promise = global.Promise || require("es6-promise").Promise
				} catch (aU) {
					throw new Error("Unable to find a Promise implementation.")
				}
			}
			var aT = Array.prototype.slice.call(arguments, 1);
			return new I.Promise(function(aW, e){
				aV.apply(null, aT.concat(function(aX, aY){
					if (!aX) {
						aW(aY)
					} else {
						e(aX)
					}
				}))
			})
		};
		I.promises({api: I.promises});
		function ap(){
		}
		
		ap.prototype = I.promises({version: "json-ld-1.0"});
		ap.prototype.toString = function(){
			if (this instanceof ap) {
				return "[object JsonLdProcessor]"
			}
			return "[object JsonLdProcessorPrototype]"
		};
		I.JsonLdProcessor = ap;
		var ab = !!Object.defineProperty;
		if (ab) {
			try {
				Object.defineProperty({}, "x", {})
			} catch (ac) {
				ab = false
			}
		}
		if (ab) {
			Object.defineProperty(ap, "prototype", {writable: false, enumerable: false});
			Object.defineProperty(ap.prototype, "constructor", {
				writable: true,
				enumerable: false,
				configurable: true,
				value: ap
			})
		}
		if (a && typeof global.JsonLdProcessor === "undefined") {
			if (ab) {
				Object.defineProperty(global, "JsonLdProcessor", {
					writable: true,
					enumerable: false,
					configurable: true,
					value: ap
				})
			} else {
				global.JsonLdProcessor = ap
			}
		}
		var aH = typeof setImmediate === "function" && setImmediate;
		var aA = aH ? function(e){
			aH(e)
		} : function(e){
			setTimeout(e, 0)
		};
		if (typeof process === "object" && typeof process.nextTick === "function") {
			I.nextTick = process.nextTick
		} else {
			I.nextTick = aA
		}
		I.setImmediate = aH ? aA : I.nextTick;
		I.parseLinkHeader = function(aV){
			var aW = {};
			var aY = aV.match(/(?:<[^>]*?>|"[^"]*?"|[^,])+/g);
			var aZ = /\s*<([^>]*?)>\s*(?:;\s*(.*))?/;
			for (var aU = 0; aU < aY.length; ++aU){
				var aX = aY[aU].match(aZ);
				if (!aX) {
					continue
				}
				var a1 = {target: aX[1]};
				var e = aX[2];
				var aT = /(.*?)=(?:(?:"([^"]*?)")|([^"]*?))\s*(?:(?:;\s*)|$)/g;
				while (aX = aT.exec(e)) {
					a1[aX[1]] = (aX[2] === undefined) ? aX[3] : aX[2]
				}
				var a0 = a1.rel || "";
				if (K(aW[a0])) {
					aW[a0].push(a1)
				} else {
					if (a0 in aW) {
						aW[a0] = [aW[a0], a1]
					} else {
						aW[a0] = a1
					}
				}
			}
			return aW
		};
		I.DocumentCache = function(e){
			this.order = [];
			this.cache = {};
			this.size = e || 50;
			this.expires = 30 * 1000
		};
		I.DocumentCache.prototype.get = function(e){
			if (e in this.cache) {
				var aT = this.cache[e];
				if (aT.expires >= +new Date()) {
					return aT.ctx
				}
				delete this.cache[e];
				this.order.splice(this.order.indexOf(e), 1)
			}
			return null
		};
		I.DocumentCache.prototype.set = function(aT, e){
			if (this.order.length === this.size) {
				delete this.cache[this.order.shift()]
			}
			this.order.push(aT);
			this.cache[aT] = {ctx: e, expires: (+new Date() + this.expires)}
		};
		I.ActiveContextCache = function(e){
			this.order = [];
			this.cache = {};
			this.size = e || 100
		};
		I.ActiveContextCache.prototype.get = function(aW, e){
			var aU = JSON.stringify(aW);
			var aT = JSON.stringify(e);
			var aV = this.cache[aU];
			if (aV && aT in aV) {
				return aV[aT]
			}
			return null
		};
		I.ActiveContextCache.prototype.set = function(aX, aT, e){
			if (this.order.length === this.size) {
				var aW = this.order.shift();
				delete this.cache[aW.activeCtx][aW.localCtx]
			}
			var aV = JSON.stringify(aX);
			var aU = JSON.stringify(aT);
			this.order.push({activeCtx: aV, localCtx: aU});
			if (!(aV in this.cache)) {
				this.cache[aV] = {}
			}
			this.cache[aV][aU] = o(e)
		};
		I.cache = {activeCtx: new I.ActiveContextCache()};
		I.documentLoaders = {};
		I.documentLoaders.jquery = function(aU, aT){
			aT = aT || {};
			var e = function(aW, aX){
				if (aW.indexOf("http:") !== 0 && aW.indexOf("https:") !== 0) {
					return aX(new x('URL could not be dereferenced; only "http" and "https" URLs are supported.', "jsonld.InvalidUrl", {
						code: "loading document failed",
						url: aW
					}), {contextUrl: null, documentUrl: aW, document: null})
				}
				if (aT.secure && aW.indexOf("https") !== 0) {
					return aX(new x('URL could not be dereferenced; secure mode is enabled and the URL\'s scheme is not "https".', "jsonld.InvalidUrl", {
						code: "loading document failed",
						url: aW
					}), {contextUrl: null, documentUrl: aW, document: null})
				}
				aU.ajax({
					url: aW,
					accepts: {json: "application/ld+json, application/json"},
					headers: {Accept: "application/ld+json, application/json"},
					dataType: "json",
					crossDomain: true,
					success: function(a0, a3, aZ){
						var a1 = {contextUrl: null, documentUrl: aW, document: a0};
						var a2 = aZ.getResponseHeader("Content-Type");
						var aY = aZ.getResponseHeader("Link");
						if (aY && a2 !== "application/ld+json") {
							aY = I.parseLinkHeader(aY)[aG];
							if (K(aY)) {
								return aX(new x("URL could not be dereferenced, it has more than one associated HTTP Link Header.", "jsonld.InvalidUrl", {
									code: "multiple context link headers",
									url: aW
								}), a1)
							}
							if (aY) {
								a1.contextUrl = aY.target
							}
						}
						aX(null, a1)
					},
					error: function(aZ, a0, aY){
						aX(new x("URL could not be dereferenced, an error occurred.", "jsonld.LoadDocumentError", {
							code: "loading document failed",
							url: aW,
							cause: aY
						}), {contextUrl: null, documentUrl: aW, document: null})
					}
				})
			};
			var aV = (typeof Promise !== "undefined");
			if ("usePromise" in aT) {
				aV = aT.usePromise
			}
			if (aV) {
				return function(aW){
					return I.promisify(e, aW)
				}
			}
			return e
		};
		I.documentLoaders.node = function(aY){
			aY = aY || {};
			var aU = ("strictSSL" in aY) ? aY.strictSSL : true;
			var aV = ("maxRedirects" in aY) ? aY.maxRedirects : -1;
			var aZ = require("request");
			var aX = require("http");
			var aW = new I.DocumentCache();
			
			function aT(a0, a4, a3){
				if (a0.indexOf("http:") !== 0 && a0.indexOf("https:") !== 0) {
					return a3(new x('URL could not be dereferenced; only "http" and "https" URLs are supported.', "jsonld.InvalidUrl", {
						code: "loading document failed",
						url: a0
					}), {contextUrl: null, documentUrl: a0, document: null})
				}
				if (aY.secure && a0.indexOf("https") !== 0) {
					return a3(new x('URL could not be dereferenced; secure mode is enabled and the URL\'s scheme is not "https".', "jsonld.InvalidUrl", {
						code: "loading document failed",
						url: a0
					}), {contextUrl: null, documentUrl: a0, document: null})
				}
				var a2 = aW.get(a0);
				if (a2 !== null) {
					return a3(null, a2)
				}
				aZ({
					url: a0,
					headers: {Accept: "application/ld+json, application/json"},
					strictSSL: aU,
					followRedirect: false
				}, a1);
				function a1(a9, a8, a6){
					a2 = {contextUrl: null, documentUrl: a0, document: a6 || null};
					if (a9) {
						return a3(new x("URL could not be dereferenced, an error occurred.", "jsonld.LoadDocumentError", {
							code: "loading document failed",
							url: a0,
							cause: a9
						}), a2)
					}
					var ba = aX.STATUS_CODES[a8.statusCode];
					if (a8.statusCode >= 400) {
						return a3(new x("URL could not be dereferenced: " + ba, "jsonld.InvalidUrl", {
							code: "loading document failed",
							url: a0,
							httpStatusCode: a8.statusCode
						}), a2)
					}
					if (a8.headers.link && a8.headers["content-type"] !== "application/ld+json") {
						var a5 = I.parseLinkHeader(a8.headers.link)[aG];
						if (K(a5)) {
							return a3(new x("URL could not be dereferenced, it has more than one associated HTTP Link Header.", "jsonld.InvalidUrl", {
								code: "multiple context link headers",
								url: a0
							}), a2)
						}
						if (a5) {
							a2.contextUrl = a5.target
						}
					}
					if (a8.statusCode >= 300 && a8.statusCode < 400 && a8.headers.location) {
						if (a4.length === aV) {
							return a3(new x("URL could not be dereferenced; there were too many redirects.", "jsonld.TooManyRedirects", {
								code: "loading document failed",
								url: a0,
								httpStatusCode: a8.statusCode,
								redirects: a4
							}), a2)
						}
						if (a4.indexOf(a0) !== -1) {
							return a3(new x("URL could not be dereferenced; infinite redirection was detected.", "jsonld.InfiniteRedirectDetected", {
								code: "recursive context inclusion",
								url: a0,
								httpStatusCode: a8.statusCode,
								redirects: a4
							}), a2)
						}
						a4.push(a0);
						return aT(a8.headers.location, a4, a3)
					}
					a4.push(a0);
					for (var a7 = 0; a7 < a4.length; ++a7){
						aW.set(a4[a7], {contextUrl: null, documentUrl: a4[a7], document: a6})
					}
					a3(a9, a2)
				}
			}
			
			var e = function(a0, a1){
				aT(a0, [], a1)
			};
			if (aY.usePromise) {
				return function(a0){
					return I.promisify(e, a0)
				}
			}
			return e
		};
		I.documentLoaders.xhr = function(aT){
			var aU = /(^|(\r\n))link:/i;
			aT = aT || {};
			var e = function(aW, aZ){
				if (aW.indexOf("http:") !== 0 && aW.indexOf("https:") !== 0) {
					return aZ(new x('URL could not be dereferenced; only "http" and "https" URLs are supported.', "jsonld.InvalidUrl", {
						code: "loading document failed",
						url: aW
					}), {contextUrl: null, documentUrl: aW, document: null})
				}
				if (aT.secure && aW.indexOf("https") !== 0) {
					return aZ(new x('URL could not be dereferenced; secure mode is enabled and the URL\'s scheme is not "https".', "jsonld.InvalidUrl", {
						code: "loading document failed",
						url: aW
					}), {contextUrl: null, documentUrl: aW, document: null})
				}
				var aY = aT.xhr || XMLHttpRequest;
				var aX = new aY();
				aX.onload = function(a2){
					if (aX.status >= 400) {
						return aZ(new x("URL could not be dereferenced: " + aX.statusText, "jsonld.LoadDocumentError", {
							code: "loading document failed",
							url: aW,
							httpStatusCode: aX.status
						}), {contextUrl: null, documentUrl: aW, document: null})
					}
					var a1 = {contextUrl: null, documentUrl: aW, document: aX.response};
					var a3 = aX.getResponseHeader("Content-Type");
					var a0;
					if (aU.test(aX.getAllResponseHeaders())) {
						a0 = aX.getResponseHeader("Link")
					}
					if (a0 && a3 !== "application/ld+json") {
						a0 = I.parseLinkHeader(a0)[aG];
						if (K(a0)) {
							return aZ(new x("URL could not be dereferenced, it has more than one associated HTTP Link Header.", "jsonld.InvalidUrl", {
								code: "multiple context link headers",
								url: aW
							}), a1)
						}
						if (a0) {
							a1.contextUrl = a0.target
						}
					}
					aZ(null, a1)
				};
				aX.onerror = function(){
					aZ(new x("URL could not be dereferenced, an error occurred.", "jsonld.LoadDocumentError", {
						code: "loading document failed",
						url: aW
					}), {contextUrl: null, documentUrl: aW, document: null})
				};
				aX.open("GET", aW, true);
				aX.setRequestHeader("Accept", "application/ld+json, application/json");
				aX.send()
			};
			var aV = (typeof Promise !== "undefined");
			if ("usePromise" in aT) {
				aV = aT.usePromise
			}
			if (aV) {
				return function(aW){
					return I.promisify(e, aW)
				}
			}
			return e
		};
		I.useDocumentLoader = function(e){
			if (!(e in I.documentLoaders)) {
				throw new x('Unknown document loader type: "' + e + '"', "jsonld.UnknownDocumentLoader", {type: e})
			}
			I.documentLoader = I.documentLoaders[e].apply(I, Array.prototype.slice.call(arguments, 1))
		};
		I.processContext = function(aV, e){
			var aT = {};
			var aU = 2;
			if (arguments.length > 3) {
				aT = arguments[2] || {};
				aU += 1
			}
			var aW = arguments[aU];
			if (!("base" in aT)) {
				aT.base = ""
			}
			if (!("documentLoader" in aT)) {
				aT.documentLoader = I.loadDocument
			}
			if (e === null) {
				return aW(null, A(aT))
			}
			e = o(e);
			if (!(aD(e) && "@context" in e)) {
				e = {"@context": e}
			}
			aM(e, aT, function(aZ, aX){
				if (aZ) {
					return aW(aZ)
				}
				try {
					aX = new m().processContext(aV, aX, aT)
				} catch (aY) {
					return aW(aY)
				}
				aW(null, aX)
			})
		};
		I.hasProperty = function(e, aU){
			var aV = false;
			if (aU in e) {
				var aT = e[aU];
				aV = (!K(aT) || aT.length > 0)
			}
			return aV
		};
		I.hasValue = function(aT, aV, aU){
			var aX = false;
			if (I.hasProperty(aT, aV)) {
				var aY = aT[aV];
				var aW = y(aY);
				if (K(aY) || aW) {
					if (aW) {
						aY = aY["@list"]
					}
					for (var e = 0; e < aY.length; ++e){
						if (I.compareValues(aU, aY[e])) {
							aX = true;
							break
						}
					}
				} else {
					if (!K(aU)) {
						aX = I.compareValues(aU, aY)
					}
				}
			}
			return aX
		};
		I.addValue = function(aV, aX, aW, e){
			e = e || {};
			if (!("propertyIsArray" in e)) {
				e.propertyIsArray = false
			}
			if (!("allowDuplicate" in e)) {
				e.allowDuplicate = true
			}
			if (K(aW)) {
				if (aW.length === 0 && e.propertyIsArray && !(aX in aV)) {
					aV[aX] = []
				}
				for (var aU = 0; aU < aW.length; ++aU){
					I.addValue(aV, aX, aW[aU], e)
				}
			} else {
				if (aX in aV) {
					var aT = (!e.allowDuplicate && I.hasValue(aV, aX, aW));
					if (!K(aV[aX]) && (!aT || e.propertyIsArray)) {
						aV[aX] = [aV[aX]]
					}
					if (!aT) {
						aV[aX].push(aW)
					}
				} else {
					aV[aX] = e.propertyIsArray ? [aW] : aW
				}
			}
		};
		I.getValues = function(e, aT){
			var aU = e[aT] || [];
			if (!K(aU)) {
				aU = [aU]
			}
			return aU
		};
		I.removeProperty = function(e, aT){
			delete e[aT]
		};
		I.removeValue = function(aU, aW, aV, aT){
			aT = aT || {};
			if (!("propertyIsArray" in aT)) {
				aT.propertyIsArray = false
			}
			var e = I.getValues(aU, aW).filter(function(aX){
				return !I.compareValues(aX, aV)
			});
			if (e.length === 0) {
				I.removeProperty(aU, aW)
			} else {
				if (e.length === 1 && !aT.propertyIsArray) {
					aU[aW] = e[0]
				} else {
					aU[aW] = e
				}
			}
		};
		I.compareValues = function(aT, e){
			if (aT === e) {
				return true
			}
			if (aK(aT) && aK(e) && aT["@value"] === e["@value"] && aT["@type"] === e["@type"] && aT["@language"] === e["@language"] && aT["@index"] === e["@index"]) {
				return true
			}
			if (aD(aT) && ("@id" in aT) && aD(e) && ("@id" in e)) {
				return aT["@id"] === e["@id"]
			}
			return false
		};
		I.getContextValue = function(e, aT, aU){
			var aW = null;
			if (aT === null) {
				return aW
			}
			if (aU === "@language" && (aU in e)) {
				aW = e[aU]
			}
			if (e.mappings[aT]) {
				var aV = e.mappings[aT];
				if (L(aU)) {
					aW = aV
				} else {
					if (aU in aV) {
						aW = aV[aU]
					}
				}
			}
			return aW
		};
		var S = {};
		I.registerRDFParser = function(aT, e){
			S[aT] = e
		};
		I.unregisterRDFParser = function(e){
			delete S[e]
		};
		if (c) {
			if (typeof E === "undefined") {
				var E = null
			}
			if (typeof ay === "undefined") {
				var ay = {
					ELEMENT_NODE: 1,
					ATTRIBUTE_NODE: 2,
					TEXT_NODE: 3,
					CDATA_SECTION_NODE: 4,
					ENTITY_REFERENCE_NODE: 5,
					ENTITY_NODE: 6,
					PROCESSING_INSTRUCTION_NODE: 7,
					COMMENT_NODE: 8,
					DOCUMENT_NODE: 9,
					DOCUMENT_TYPE_NODE: 10,
					DOCUMENT_FRAGMENT_NODE: 11,
					NOTATION_NODE: 12
				}
			}
		}
		var Z = "http://www.w3.org/2001/XMLSchema#boolean";
		var W = "http://www.w3.org/2001/XMLSchema#double";
		var t = "http://www.w3.org/2001/XMLSchema#integer";
		var z = "http://www.w3.org/2001/XMLSchema#string";
		var g = "http://www.w3.org/1999/02/22-rdf-syntax-ns#";
		var aP = g + "List";
		var at = g + "first";
		var H = g + "rest";
		var ak = g + "nil";
		var D = g + "type";
		var af = g + "PlainLiteral";
		var C = g + "XMLLiteral";
		var N = g + "object";
		var u = g + "langString";
		var aG = "http://www.w3.org/ns/json-ld#context";
		var ad = 10;
		var x = function(aU, aT, e){
			if (c) {
				Error.call(this);
				Error.captureStackTrace(this, this.constructor)
			} else {
				if (typeof Error !== "undefined") {
					this.stack = (new Error()).stack
				}
			}
			this.name = aT || "jsonld.Error";
			this.message = aU || "An unspecified JSON-LD error occurred.";
			this.details = e || {}
		};
		if (c) {
			require("util").inherits(x, Error)
		} else {
			if (typeof Error !== "undefined") {
				x.prototype = new Error()
			}
		}
		var m = function(){
		};
		m.prototype.compact = function(be, a7, aT, aX){
			if (K(aT)) {
				var bj = [];
				for (var bd = 0; bd < aT.length; ++bd){
					var bc = this.compact(be, a7, aT[bd], aX);
					if (bc !== null) {
						bj.push(bc)
					}
				}
				if (aX.compactArrays && bj.length === 1) {
					var a8 = I.getContextValue(be, a7, "@container");
					if (a8 === null) {
						bj = bj[0]
					}
				}
				return bj
			}
			if (aD(aT)) {
				if (aX.link && "@id" in aT && aT["@id"] in aX.link) {
					var bg = aX.link[aT["@id"]];
					for (var bd = 0; bd < bg.length; ++bd){
						if (bg[bd].expanded === aT) {
							return bg[bd].compacted
						}
					}
				}
				if (aK(aT) || ax(aT)) {
					var bj = aS(be, a7, aT);
					if (aX.link && ax(aT)) {
						if (!(aT["@id"] in aX.link)) {
							aX.link[aT["@id"]] = []
						}
						aX.link[aT["@id"]].push({expanded: aT, compacted: bj})
					}
					return bj
				}
				var a6 = (a7 === "@reverse");
				var bj = {};
				if (aX.link && "@id" in aT) {
					if (!(aT["@id"] in aX.link)) {
						aX.link[aT["@id"]] = []
					}
					aX.link[aT["@id"]].push({expanded: aT, compacted: bj})
				}
				var a9 = Object.keys(aT).sort();
				for (var aY = 0; aY < a9.length; ++aY){
					var aZ = a9[aY];
					var aU = aT[aZ];
					if (aZ === "@id" || aZ === "@type") {
						var a3;
						if (aa(aU)) {
							a3 = aI(be, aU, null, {vocab: (aZ === "@type")})
						} else {
							a3 = [];
							for (var bi = 0; bi < aU.length; ++bi){
								a3.push(aI(be, aU[bi], null, {vocab: true}))
							}
						}
						var ba = aI(be, aZ);
						var a5 = (K(a3) && aU.length === 0);
						I.addValue(bj, ba, a3, {propertyIsArray: a5});
						continue
					}
					if (aZ === "@reverse") {
						var a3 = this.compact(be, "@reverse", aU, aX);
						for (var a0 in a3){
							if (be.mappings[a0] && be.mappings[a0].reverse) {
								var bb = a3[a0];
								var a8 = I.getContextValue(be, a0, "@container");
								var a4 = (a8 === "@set" || !aX.compactArrays);
								I.addValue(bj, a0, bb, {propertyIsArray: a4});
								delete a3[a0]
							}
						}
						if (Object.keys(a3).length > 0) {
							var ba = aI(be, aZ);
							I.addValue(bj, ba, a3)
						}
						continue
					}
					if (aZ === "@index") {
						var a8 = I.getContextValue(be, a7, "@container");
						if (a8 === "@index") {
							continue
						}
						var ba = aI(be, aZ);
						I.addValue(bj, ba, aU);
						continue
					}
					if (aZ !== "@graph" && aZ !== "@list" && R(aZ)) {
						var ba = aI(be, aZ);
						I.addValue(bj, ba, aU);
						continue
					}
					if (aU.length === 0) {
						var aW = aI(be, aZ, aU, {vocab: true}, a6);
						I.addValue(bj, aW, aU, {propertyIsArray: true})
					}
					for (var bi = 0; bi < aU.length; ++bi){
						var a2 = aU[bi];
						var aW = aI(be, aZ, a2, {vocab: true}, a6);
						var a8 = I.getContextValue(be, aW, "@container");
						var bh = y(a2);
						var bf = null;
						if (bh) {
							bf = a2["@list"]
						}
						var aV = this.compact(be, aW, bh ? bf : a2, aX);
						if (bh) {
							if (!K(aV)) {
								aV = [aV]
							}
							if (a8 !== "@list") {
								var a1 = {};
								a1[aI(be, "@list")] = aV;
								aV = a1;
								if ("@index" in a2) {
									aV[aI(be, "@index")] = a2["@index"]
								}
							} else {
								if (aW in bj) {
									throw new x('JSON-LD compact error; property has a "@list" @container rule but there is more than a single @list that matches the compacted term in the document. Compaction might mix unwanted items into the list.', "jsonld.SyntaxError", {code: "compaction to list of lists"})
								}
							}
						}
						if (a8 === "@language" || a8 === "@index") {
							var e;
							if (aW in bj) {
								e = bj[aW]
							} else {
								bj[aW] = e = {}
							}
							if (a8 === "@language" && aK(aV)) {
								aV = aV["@value"]
							}
							I.addValue(e, a2[a8], aV)
						} else {
							var a5 = (!aX.compactArrays || a8 === "@set" || a8 === "@list" || (K(aV) && aV.length === 0) || aZ === "@list" || aZ === "@graph");
							I.addValue(bj, aW, aV, {propertyIsArray: a5})
						}
					}
				}
				return bj
			}
			return aT
		};
		m.prototype.expand = function(bf, a6, aU, aW, bc){
			var bb = this;
			if (aU === null || aU === undefined) {
				return null
			}
			if (!K(aU) && !aD(aU)) {
				if (!bc && (a6 === null || G(bf, a6, {vocab: true}) === "@graph")) {
					return null
				}
				return B(bf, a6, aU)
			}
			if (K(aU)) {
				var bj = [];
				var a7 = I.getContextValue(bf, a6, "@container");
				bc = bc || a7 === "@list";
				for (var be = 0; be < aU.length; ++be){
					var bg = bb.expand(bf, a6, aU[be], aW);
					if (bc && (K(bg) || y(bg))) {
						throw new x("Invalid JSON-LD syntax; lists of lists are not permitted.", "jsonld.SyntaxError", {code: "list of lists"})
					}
					if (bg !== null) {
						if (K(bg)) {
							bj = bj.concat(bg)
						} else {
							bj.push(bg)
						}
					}
				}
				return bj
			}
			if ("@context" in aU) {
				bf = bb.processContext(bf, aU["@context"], aW)
			}
			var a3 = G(bf, a6, {vocab: true});
			var bj = {};
			var a8 = Object.keys(aU).sort();
			for (var aX = 0; aX < a8.length; ++aX){
				var bk = a8[aX];
				var bd = aU[bk];
				var aV;
				if (bk === "@context") {
					continue
				}
				var aY = G(bf, bk, {vocab: true});
				if (aY === null || !(aq(aY) || R(aY))) {
					continue
				}
				if (R(aY)) {
					if (a3 === "@reverse") {
						throw new x("Invalid JSON-LD syntax; a keyword cannot be used as a @reverse property.", "jsonld.SyntaxError", {
							code: "invalid reverse property map",
							value: bd
						})
					}
					if (aY in bj) {
						throw new x("Invalid JSON-LD syntax; colliding keywords detected.", "jsonld.SyntaxError", {
							code: "colliding keywords",
							keyword: aY
						})
					}
				}
				if (aY === "@id" && !aa(bd)) {
					if (!aW.isFrame) {
						throw new x('Invalid JSON-LD syntax; "@id" value must a string.', "jsonld.SyntaxError", {
							code: "invalid @id value",
							value: bd
						})
					}
					if (!aD(bd)) {
						throw new x('Invalid JSON-LD syntax; "@id" value must be a string or an object.', "jsonld.SyntaxError", {
							code: "invalid @id value",
							value: bd
						})
					}
				}
				if (aY === "@type") {
					P(bd)
				}
				if (aY === "@graph" && !(aD(bd) || K(bd))) {
					throw new x('Invalid JSON-LD syntax; "@graph" value must not be an object or an array.', "jsonld.SyntaxError", {
						code: "invalid @graph value",
						value: bd
					})
				}
				if (aY === "@value" && (aD(bd) || K(bd))) {
					throw new x('Invalid JSON-LD syntax; "@value" value must not be an object or an array.', "jsonld.SyntaxError", {
						code: "invalid value object value",
						value: bd
					})
				}
				if (aY === "@language") {
					if (bd === null) {
						continue
					}
					if (!aa(bd)) {
						throw new x('Invalid JSON-LD syntax; "@language" value must be a string.', "jsonld.SyntaxError", {
							code: "invalid language-tagged string",
							value: bd
						})
					}
					bd = bd.toLowerCase()
				}
				if (aY === "@index") {
					if (!aa(bd)) {
						throw new x('Invalid JSON-LD syntax; "@index" value must be a string.', "jsonld.SyntaxError", {
							code: "invalid @index value",
							value: bd
						})
					}
				}
				if (aY === "@reverse") {
					if (!aD(bd)) {
						throw new x('Invalid JSON-LD syntax; "@reverse" value must be an object.', "jsonld.SyntaxError", {
							code: "invalid @reverse value",
							value: bd
						})
					}
					aV = bb.expand(bf, "@reverse", bd, aW);
					if ("@reverse" in aV) {
						for (var a0 in aV["@reverse"]){
							I.addValue(bj, a0, aV["@reverse"][a0], {propertyIsArray: true})
						}
					}
					var a1 = bj["@reverse"] || null;
					for (var a0 in aV){
						if (a0 === "@reverse") {
							continue
						}
						if (a1 === null) {
							a1 = bj["@reverse"] = {}
						}
						I.addValue(a1, a0, [], {propertyIsArray: true});
						var ba = aV[a0];
						for (var a5 = 0; a5 < ba.length; ++a5){
							var bh = ba[a5];
							if (aK(bh) || y(bh)) {
								throw new x('Invalid JSON-LD syntax; "@reverse" value must not be a @value or an @list.', "jsonld.SyntaxError", {
									code: "invalid reverse property value",
									value: aV
								})
							}
							I.addValue(a1, a0, bh, {propertyIsArray: true})
						}
					}
					continue
				}
				var a7 = I.getContextValue(bf, bk, "@container");
				if (a7 === "@language" && aD(bd)) {
					aV = aC(bd)
				} else {
					if (a7 === "@index" && aD(bd)) {
						aV = (function a9(br){
							var bn = [];
							var bm = Object.keys(bd).sort();
							for (var bq = 0; bq < bm.length; ++bq){
								var e = bm[bq];
								var bp = bd[e];
								if (!K(bp)) {
									bp = [bp]
								}
								bp = bb.expand(bf, br, bp, aW, false);
								for (var bo = 0; bo < bp.length; ++bo){
									var bl = bp[bo];
									if (!("@index" in bl)) {
										bl["@index"] = e
									}
									bn.push(bl)
								}
							}
							return bn
						})(bk)
					} else {
						var bi = (aY === "@list");
						if (bi || aY === "@set") {
							var aT = a6;
							if (bi && a3 === "@graph") {
								aT = null
							}
							aV = bb.expand(bf, aT, bd, aW, bi);
							if (bi && y(aV)) {
								throw new x("Invalid JSON-LD syntax; lists of lists are not permitted.", "jsonld.SyntaxError", {code: "list of lists"})
							}
						} else {
							aV = bb.expand(bf, bk, bd, aW, false)
						}
					}
				}
				if (aV === null && aY !== "@value") {
					continue
				}
				if (aY !== "@list" && !y(aV) && a7 === "@list") {
					aV = (K(aV) ? aV : [aV]);
					aV = {"@list": aV}
				}
				if (bf.mappings[bk] && bf.mappings[bk].reverse) {
					var a1 = bj["@reverse"] = bj["@reverse"] || {};
					if (!K(aV)) {
						aV = [aV]
					}
					for (var a5 = 0; a5 < aV.length; ++a5){
						var bh = aV[a5];
						if (aK(bh) || y(bh)) {
							throw new x('Invalid JSON-LD syntax; "@reverse" value must not be a @value or an @list.', "jsonld.SyntaxError", {
								code: "invalid reverse property value",
								value: aV
							})
						}
						I.addValue(a1, aY, bh, {propertyIsArray: true})
					}
					continue
				}
				var a4 = ["@index", "@id", "@type", "@value", "@language"].indexOf(aY) === -1;
				I.addValue(bj, aY, aV, {propertyIsArray: a4})
			}
			a8 = Object.keys(bj);
			var aZ = a8.length;
			if ("@value" in bj) {
				if ("@type" in bj && "@language" in bj) {
					throw new x('Invalid JSON-LD syntax; an element containing "@value" may not contain both "@type" and "@language".', "jsonld.SyntaxError", {
						code: "invalid value object",
						element: bj
					})
				}
				var a2 = aZ - 1;
				if ("@type" in bj) {
					a2 -= 1
				}
				if ("@index" in bj) {
					a2 -= 1
				}
				if ("@language" in bj) {
					a2 -= 1
				}
				if (a2 !== 0) {
					throw new x('Invalid JSON-LD syntax; an element containing "@value" may only have an "@index" property and at most one other property which can be "@type" or "@language".', "jsonld.SyntaxError", {
						code: "invalid value object",
						element: bj
					})
				}
				if (bj["@value"] === null) {
					bj = null
				} else {
					if ("@language" in bj && !aa(bj["@value"])) {
						throw new x("Invalid JSON-LD syntax; only strings may be language-tagged.", "jsonld.SyntaxError", {
							code: "invalid language-tagged value",
							element: bj
						})
					} else {
						if ("@type" in bj && (!aq(bj["@type"]) || bj["@type"].indexOf("_:") === 0)) {
							throw new x('Invalid JSON-LD syntax; an element containing "@value" and "@type" must have an absolute IRI for the value of "@type".', "jsonld.SyntaxError", {
								code: "invalid typed value",
								element: bj
							})
						}
					}
				}
			} else {
				if ("@type" in bj && !K(bj["@type"])) {
					bj["@type"] = [bj["@type"]]
				} else {
					if ("@set" in bj || "@list" in bj) {
						if (aZ > 1 && !(aZ === 2 && "@index" in bj)) {
							throw new x('Invalid JSON-LD syntax; if an element has the property "@set" or "@list", then it can have at most one other property that is "@index".', "jsonld.SyntaxError", {
								code: "invalid set or list object",
								element: bj
							})
						}
						if ("@set" in bj) {
							bj = bj["@set"];
							a8 = Object.keys(bj);
							aZ = a8.length
						}
					} else {
						if (aZ === 1 && "@language" in bj) {
							bj = null
						}
					}
				}
			}
			if (aD(bj) && !aW.keepFreeFloatingNodes && !bc && (a6 === null || a3 === "@graph")) {
				if (aZ === 0 || "@value" in bj || "@list" in bj || (aZ === 1 && "@id" in bj)) {
					bj = null
				}
			}
			return bj
		};
		m.prototype.createNodeMap = function(aT, aU){
			aU = aU || {};
			var aV = aU.namer || new j("_:b");
			var e = {"@default": {}};
			ae(aT, e, "@default", aV);
			return ah(e)
		};
		m.prototype.flatten = function(aT){
			var e = this.createNodeMap(aT);
			var aU = [];
			var aW = Object.keys(e).sort();
			for (var aX = 0; aX < aW.length; ++aX){
				var aV = e[aW[aX]];
				if (!ax(aV)) {
					aU.push(aV)
				}
			}
			return aU
		};
		m.prototype.frame = function(aT, aX, aU){
			var aV = {options: aU, graphs: {"@default": {}, "@merged": {}}, subjectStack: [], link: {}};
			var aW = new j("_:b");
			ae(aT, aV.graphs, "@merged", aW);
			aV.subjects = aV.graphs["@merged"];
			var e = [];
			O(aV, Object.keys(aV.subjects).sort(), aX, e, null);
			return e
		};
		m.prototype.normalize = function(aY, e, aT){
			var aV = [];
			var a1 = {};
			for (var a8 in aY){
				var a3 = aY[a8];
				if (a8 === "@default") {
					a8 = null
				}
				for (var aU = 0; aU < a3.length; ++aU){
					var aX = a3[aU];
					if (a8 !== null) {
						if (a8.indexOf("_:") === 0) {
							aX.name = {type: "blank node", value: a8}
						} else {
							aX.name = {type: "IRI", value: a8}
						}
					}
					aV.push(aX);
					var a4 = ["subject", "object", "name"];
					for (var a7 = 0; a7 < a4.length; ++a7){
						var a5 = a4[a7];
						if (aX[a5] && aX[a5].type === "blank node") {
							var a2 = aX[a5].value;
							if (a2 in a1) {
								a1[a2].quads.push(aX)
							} else {
								a1[a2] = {quads: [aX]}
							}
						}
					}
				}
			}
			var aZ = new j("_:c14n");
			return a9(Object.keys(a1));
			function a9(bb){
				var bc = [];
				var be = {};
				var bd = {};
				I.setImmediate(function(){
					ba(0)
				});
				function ba(bg){
					if (bg === bb.length) {
						return aW(bd, be, bc)
					}
					var bf = bb[bg];
					var bh = aF(bf, a1);
					if (bh in be) {
						be[bh].push(bf);
						bc.push(bf)
					} else {
						if (bh in bd) {
							be[bh] = [bd[bh], bf];
							bc.push(bd[bh]);
							bc.push(bf);
							delete bd[bh]
						} else {
							bd[bh] = bf
						}
					}
					I.setImmediate(function(){
						ba(bg + 1)
					})
				}
			}
			
			function aW(bf, bg, bd){
				var bb = false;
				var bc = Object.keys(bf).sort();
				for (var be = 0; be < bc.length; ++be){
					var ba = bf[bc[be]];
					aZ.getName(ba);
					bb = true
				}
				if (bb) {
					a9(bd)
				} else {
					a0(bg)
				}
			}
			
			function a0(bc){
				var ba = Object.keys(bc).sort();
				bb(0);
				function bb(be){
					if (be === ba.length) {
						return a6()
					}
					var bf = bc[ba[be]];
					var bd = [];
					bg(bf, 0);
					function bg(bl, bm){
						if (bm === bl.length) {
							bd.sort(function(bo, bn){
								bo = bo.hash;
								bn = bn.hash;
								return (bo < bn) ? -1 : ((bo > bn) ? 1 : 0)
							});
							for (var bk = 0; bk < bd.length; ++bk){
								for (var bi in bd[bk].pathNamer.existing){
									aZ.getName(bi)
								}
							}
							return bb(be + 1)
						}
						var bh = bl[bm];
						if (aZ.isNamed(bh)) {
							return bg(bl, bm + 1)
						}
						var bj = new j("_:b");
						bj.getName(bh);
						M(bh, a1, aZ, bj, function(bo, bn){
							if (bo) {
								return aT(bo)
							}
							bd.push(bn);
							bg(bl, bm + 1)
						})
					}
				}
			}
			
			function a6(){
				var bf = [];
				for (var be = 0; be < aV.length; ++be){
					var bc = aV[be];
					var bd = ["subject", "object", "name"];
					for (var bb = 0; bb < bd.length; ++bb){
						var ba = bd[bb];
						if (bc[ba] && bc[ba].type === "blank node" && bc[ba].value.indexOf("_:c14n") !== 0) {
							bc[ba].value = aZ.getName(bc[ba].value)
						}
					}
					bf.push(Y(bc, bc.name ? bc.name.value : null))
				}
				bf.sort();
				if (e.format) {
					if (e.format === "application/nquads") {
						return aT(null, bf.join(""))
					}
					return aT(new x("Unknown output format.", "jsonld.UnknownFormat", {format: e.format}))
				}
				aT(null, U(bf.join("")))
			}
		};
		m.prototype.fromRDF = function(a6, aX, a0){
			var aW = {};
			var bg = {"@default": aW};
			var ba = {};
			for (var bp in a6){
				var aV = a6[bp];
				if (!(bp in bg)) {
					bg[bp] = {}
				}
				if (bp !== "@default" && !(bp in aW)) {
					aW[bp] = {"@id": bp}
				}
				var e = bg[bp];
				for (var a1 = 0; a1 < aV.length; ++a1){
					var bk = aV[a1];
					var a8 = bk.subject.value;
					var bc = bk.predicate.value;
					var bd = bk.object;
					if (!(a8 in e)) {
						e[a8] = {"@id": a8}
					}
					var bf = e[a8];
					var a5 = (bd.type === "IRI" || bd.type === "blank node");
					if (a5 && !(bd.value in e)) {
						e[bd.value] = {"@id": bd.value}
					}
					if (bc === D && !aX.useRdfType && a5) {
						I.addValue(bf, "@type", bd.value, {propertyIsArray: true});
						continue
					}
					var be = f(bd, aX.useNativeTypes);
					I.addValue(bf, bc, be, {propertyIsArray: true});
					if (a5) {
						if (bd.value === ak) {
							var bo = e[bd.value];
							if (!("usages" in bo)) {
								bo.usages = []
							}
							bo.usages.push({node: bf, property: bc, value: be})
						} else {
							if (bd.value in ba) {
								ba[bd.value] = false
							} else {
								ba[bd.value] = {node: bf, property: bc, value: be}
							}
						}
					}
				}
			}
			for (var bp in bg){
				var bj = bg[bp];
				if (!(ak in bj)) {
					continue
				}
				var a3 = bj[ak];
				for (var bi = 0; bi < a3.usages.length; ++bi){
					var bm = a3.usages[bi];
					var bf = bm.node;
					var a4 = bm.property;
					var aZ = bm.value;
					var bl = [];
					var bb = [];
					var aT = Object.keys(bf).length;
					while (a4 === H && aD(ba[bf["@id"]]) && K(bf[at]) && bf[at].length === 1 && K(bf[H]) && bf[H].length === 1 && (aT === 3 || (aT === 4 && K(bf["@type"]) && bf["@type"].length === 1 && bf["@type"][0] === aP))) {
						bl.push(bf[at][0]);
						bb.push(bf["@id"]);
						bm = ba[bf["@id"]];
						bf = bm.node;
						a4 = bm.property;
						aZ = bm.value;
						aT = Object.keys(bf).length;
						if (bf["@id"].indexOf("_:") !== 0) {
							break
						}
					}
					if (a4 === at) {
						if (bf["@id"] === ak) {
							continue
						}
						aZ = bj[aZ["@id"]][H][0];
						bl.pop();
						bb.pop()
					}
					delete aZ["@id"];
					aZ["@list"] = bl.reverse();
					for (var bh = 0; bh < bb.length; ++bh){
						delete bj[bb[bh]]
					}
				}
				delete a3.usages
			}
			var a7 = [];
			var a9 = Object.keys(aW).sort();
			for (var bi = 0; bi < a9.length; ++bi){
				var a2 = a9[bi];
				var bf = aW[a2];
				if (a2 in bg) {
					var aV = bf["@graph"] = [];
					var bj = bg[a2];
					var aY = Object.keys(bj).sort();
					for (var bn = 0; bn < aY.length; ++bn){
						var aU = bj[aY[bn]];
						if (!ax(aU)) {
							aV.push(aU)
						}
					}
				}
				if (!ax(bf)) {
					a7.push(bf)
				}
			}
			a0(null, a7)
		};
		m.prototype.toRDF = function(aT, aU){
			var aZ = new j("_:b");
			var aX = {"@default": {}};
			ae(aT, aX, "@default", aZ);
			var aY = {};
			var e = Object.keys(aX).sort();
			for (var aW = 0; aW < e.length; ++aW){
				var aV = e[aW];
				if (aV === "@default" || aq(aV)) {
					aY[aV] = h(aX[aV], aZ, aU)
				}
			}
			return aY
		};
		m.prototype.processContext = function(a0, aX, a3){
			if (aD(aX) && "@context" in aX && K(aX["@context"])) {
				aX = aX["@context"]
			}
			var aY = K(aX) ? aX : [aX];
			if (aY.length === 0) {
				return a0.clone()
			}
			var aW = a0;
			for (var aV = 0; aV < aY.length; ++aV){
				var a2 = aY[aV];
				if (a2 === null) {
					aW = a0 = A(a3);
					continue
				}
				if (aD(a2) && "@context" in a2) {
					a2 = a2["@context"]
				}
				if (!aD(a2)) {
					throw new x("Invalid JSON-LD syntax; @context must be an object.", "jsonld.SyntaxError", {
						code: "invalid local context",
						context: a2
					})
				}
				if (I.cache.activeCtx) {
					var aT = I.cache.activeCtx.get(a0, a2);
					if (aT) {
						aW = a0 = aT;
						continue
					}
				}
				a0 = aW;
				aW = aW.clone();
				var aU = {};
				if ("@base" in a2) {
					var e = a2["@base"];
					if (e === null) {
						e = null
					} else {
						if (!aa(e)) {
							throw new x('Invalid JSON-LD syntax; the value of "@base" in a @context must be a string or null.', "jsonld.SyntaxError", {
								code: "invalid base IRI",
								context: a2
							})
						} else {
							if (e !== "" && !aq(e)) {
								throw new x('Invalid JSON-LD syntax; the value of "@base" in a @context must be an absolute IRI or the empty string.', "jsonld.SyntaxError", {
									code: "invalid base IRI",
									context: a2
								})
							}
						}
					}
					if (e !== null) {
						e = I.url.parse(e || "")
					}
					aW["@base"] = e;
					aU["@base"] = true
				}
				if ("@vocab" in a2) {
					var aZ = a2["@vocab"];
					if (aZ === null) {
						delete aW["@vocab"]
					} else {
						if (!aa(aZ)) {
							throw new x('Invalid JSON-LD syntax; the value of "@vocab" in a @context must be a string or null.', "jsonld.SyntaxError", {
								code: "invalid vocab mapping",
								context: a2
							})
						} else {
							if (!aq(aZ)) {
								throw new x('Invalid JSON-LD syntax; the value of "@vocab" in a @context must be an absolute IRI.', "jsonld.SyntaxError", {
									code: "invalid vocab mapping",
									context: a2
								})
							} else {
								aW["@vocab"] = aZ
							}
						}
					}
					aU["@vocab"] = true
				}
				if ("@language" in a2) {
					var aZ = a2["@language"];
					if (aZ === null) {
						delete aW["@language"]
					} else {
						if (!aa(aZ)) {
							throw new x('Invalid JSON-LD syntax; the value of "@language" in a @context must be a string or null.', "jsonld.SyntaxError", {
								code: "invalid default language",
								context: a2
							})
						} else {
							aW["@language"] = aZ.toLowerCase()
						}
					}
					aU["@language"] = true
				}
				for (var a1 in a2){
					r(aW, a2, a1, aU)
				}
				if (I.cache.activeCtx) {
					I.cache.activeCtx.set(a0, a2, aW)
				}
			}
			return aW
		};
		function aC(aZ){
			var aV = [];
			var aU = Object.keys(aZ).sort();
			for (var aY = 0; aY < aU.length; ++aY){
				var e = aU[aY];
				var aX = aZ[e];
				if (!K(aX)) {
					aX = [aX]
				}
				for (var aW = 0; aW < aX.length; ++aW){
					var aT = aX[aW];
					if (!aa(aT)) {
						throw new x("Invalid JSON-LD syntax; language map values must be strings.", "jsonld.SyntaxError", {
							code: "invalid language map value",
							languageMap: aZ
						})
					}
					aV.push({"@value": aT, "@language": e.toLowerCase()})
				}
			}
			return aV
		}
		
		function X(aX, aU){
			if (K(aU)) {
				for (var aT = 0; aT < aU.length; ++aT){
					aU[aT] = X(aX, aU[aT])
				}
			} else {
				if (y(aU)) {
					aU["@list"] = X(aX, aU["@list"])
				} else {
					if (aD(aU)) {
						if (av(aU)) {
							aU["@id"] = aX.getName(aU["@id"])
						}
						var aV = Object.keys(aU).sort();
						for (var aW = 0; aW < aV.length; ++aW){
							var e = aV[aW];
							if (e !== "@id") {
								aU[e] = X(aX, aU[e])
							}
						}
					}
				}
			}
			return aU
		}
		
		function B(aV, aX, aU){
			if (aU === null || aU === undefined) {
				return null
			}
			var e = G(aV, aX, {vocab: true});
			if (e === "@id") {
				return G(aV, aU, {base: true})
			} else {
				if (e === "@type") {
					return G(aV, aU, {vocab: true, base: true})
				}
			}
			var aT = I.getContextValue(aV, aX, "@type");
			if (aT === "@id" || (e === "@graph" && aa(aU))) {
				return {"@id": G(aV, aU, {base: true})}
			}
			if (aT === "@vocab") {
				return {"@id": G(aV, aU, {vocab: true, base: true})}
			}
			if (R(e)) {
				return aU
			}
			var aW = {};
			if (aT !== null) {
				aW["@type"] = aT
			} else {
				if (aa(aU)) {
					var aY = I.getContextValue(aV, aX, "@language");
					if (aY !== null) {
						aW["@language"] = aY
					}
				}
			}
			if (["boolean", "number", "string"].indexOf(typeof aU) === -1) {
				aU = aU.toString()
			}
			aW["@value"] = aU;
			return aW
		}
		
		function h(a6, a2, a8){
			var aY = [];
			var e = Object.keys(a6).sort();
			for (var aW = 0; aW < e.length; ++aW){
				var aT = e[aW];
				var aU = a6[aT];
				var a0 = Object.keys(aU).sort();
				for (var aX = 0; aX < a0.length; ++aX){
					var a4 = a0[aX];
					var aZ = aU[a4];
					if (a4 === "@type") {
						a4 = D
					} else {
						if (R(a4)) {
							continue
						}
					}
					for (var a5 = 0; a5 < aZ.length; ++a5){
						var a7 = aZ[a5];
						var a1 = {};
						a1.type = (aT.indexOf("_:") === 0) ? "blank node" : "IRI";
						a1.value = aT;
						if (!aq(aT)) {
							continue
						}
						var a3 = {};
						a3.type = (a4.indexOf("_:") === 0) ? "blank node" : "IRI";
						a3.value = a4;
						if (!aq(a4)) {
							continue
						}
						if (a3.type === "blank node" && !a8.produceGeneralizedRdf) {
							continue
						}
						if (y(a7)) {
							ag(a7["@list"], a2, a1, a3, aY)
						} else {
							var aV = an(a7);
							if (aV) {
								aY.push({subject: a1, predicate: a3, object: aV})
							}
						}
					}
				}
			}
			return aY
		}
		
		function ag(aX, a0, aY, a1, a2){
			var aV = {type: "IRI", value: at};
			var e = {type: "IRI", value: H};
			var aZ = {type: "IRI", value: ak};
			for (var aU = 0; aU < aX.length; ++aU){
				var a3 = aX[aU];
				var aW = {type: "blank node", value: a0.getName()};
				a2.push({subject: aY, predicate: a1, object: aW});
				aY = aW;
				a1 = aV;
				var aT = an(a3);
				if (aT) {
					a2.push({subject: aY, predicate: a1, object: aT})
				}
				a1 = e
			}
			a2.push({subject: aY, predicate: a1, object: aZ})
		}
		
		function an(aU){
			var e = {};
			if (aK(aU)) {
				e.type = "literal";
				var aV = aU["@value"];
				var aT = aU["@type"] || null;
				if (i(aV)) {
					e.value = aV.toString();
					e.datatype = aT || Z
				} else {
					if (ao(aV) || aT === W) {
						if (!ao(aV)) {
							aV = parseFloat(aV)
						}
						e.value = aV.toExponential(15).replace(/(\d)0*e\+?/, "$1E");
						e.datatype = aT || W
					} else {
						if (aO(aV)) {
							e.value = aV.toFixed(0);
							e.datatype = aT || t
						} else {
							if ("@language" in aU) {
								e.value = aV;
								e.datatype = aT || u;
								e.language = aU["@language"]
							} else {
								e.value = aV;
								e.datatype = aT || z
							}
						}
					}
				}
			} else {
				var aW = aD(aU) ? aU["@id"] : aU;
				e.type = (aW.indexOf("_:") === 0) ? "blank node" : "IRI";
				e.value = aW
			}
			if (e.type === "IRI" && !aq(e.value)) {
				return null
			}
			return e
		}
		
		function f(aW, aT){
			if (aW.type === "IRI" || aW.type === "blank node") {
				return {"@id": aW.value}
			}
			var aV = {"@value": aW.value};
			if (aW.language) {
				aV["@language"] = aW.language
			} else {
				var aU = aW.datatype;
				if (!aU) {
					aU = z
				}
				if (aT) {
					if (aU === Z) {
						if (aV["@value"] === "true") {
							aV["@value"] = true
						} else {
							if (aV["@value"] === "false") {
								aV["@value"] = false
							}
						}
					} else {
						if (T(aV["@value"])) {
							if (aU === t) {
								var e = parseInt(aV["@value"], 10);
								if (e.toFixed(0) === aV["@value"]) {
									aV["@value"] = e
								}
							} else {
								if (aU === W) {
									aV["@value"] = parseFloat(aV["@value"])
								}
							}
						}
					}
					if ([Z, t, W, z].indexOf(aU) === -1) {
						aV["@type"] = aU
					}
				} else {
					if (aU !== z) {
						aV["@type"] = aU
					}
				}
			}
			return aV
		}
		
		function q(aW, aV){
			var aT = ["subject", "predicate", "object"];
			for (var aU = 0; aU < aT.length; ++aU){
				var e = aT[aU];
				if (aW[e].type !== aV[e].type || aW[e].value !== aV[e].value) {
					return false
				}
			}
			if (aW.object.language !== aV.object.language) {
				return false
			}
			if (aW.object.datatype !== aV.object.datatype) {
				return false
			}
			return true
		}
		
		function aF(aX, aV){
			if ("hash" in aV[aX]) {
				return aV[aX].hash
			}
			var e = aV[aX].quads;
			var aT = [];
			for (var aU = 0; aU < e.length; ++aU){
				aT.push(Y(e[aU], e[aU].name ? e[aU].name.value : null, aX))
			}
			aT.sort();
			var aW = aV[aX].hash = au.hash(aT);
			return aW
		}
		
		function M(e, aT, aY, aV, a1){
			var aZ = au.create();
			var aU = {};
			var a0;
			var a2 = aT[e].quads;
			I.setImmediate(function(){
				aW(0)
			});
			function aW(a7){
				if (a7 === a2.length) {
					a0 = Object.keys(aU).sort();
					return aX(0)
				}
				var a4 = a2[a7];
				var a3 = ar(a4.subject, e);
				var a9 = null;
				if (a3 !== null) {
					a9 = "p"
				} else {
					a3 = ar(a4.object, e);
					if (a3 !== null) {
						a9 = "r"
					}
				}
				if (a3 !== null) {
					var a5;
					if (aY.isNamed(a3)) {
						a5 = aY.getName(a3)
					} else {
						if (aV.isNamed(a3)) {
							a5 = aV.getName(a3)
						} else {
							a5 = aF(a3, aT)
						}
					}
					var a8 = au.create();
					a8.update(a9);
					a8.update(a4.predicate.value);
					a8.update(a5);
					var a6 = a8.digest();
					if (a6 in aU) {
						aU[a6].push(a3)
					} else {
						aU[a6] = [a3]
					}
				}
				I.setImmediate(function(){
					aW(a7 + 1)
				})
			}
			
			function aX(a7){
				if (a7 === a0.length) {
					return a1(null, {hash: aZ.digest(), pathNamer: aV})
				}
				var a6 = a0[a7];
				aZ.update(a6);
				var a4 = null;
				var a5 = null;
				var a3 = new n(aU[a6]);
				I.setImmediate(function(){
					a8()
				});
				function a8(){
					var bd = a3.next();
					var bb = aV.clone();
					var bf = "";
					var be = [];
					for (var bg in bd){
						var a9 = bd[bg];
						if (aY.isNamed(a9)) {
							bf += aY.getName(a9)
						} else {
							if (!bb.isNamed(a9)) {
								be.push(a9)
							}
							bf += bb.getName(a9)
						}
						if (a4 !== null && bf.length >= a4.length && bf > a4) {
							return bc(true)
						}
					}
					ba(0);
					function ba(bi){
						if (bi === be.length) {
							return bc(false)
						}
						var bh = be[bi];
						M(bh, aT, aY, bb, function(bk, bj){
							if (bk) {
								return a1(bk)
							}
							bf += bb.getName(bh) + "<" + bj.hash + ">";
							bb = bj.pathNamer;
							if (a4 !== null && bf.length >= a4.length && bf > a4) {
								return bc(true)
							}
							ba(bi + 1)
						})
					}
					
					function bc(bh){
						if (!bh && (a4 === null || bf < a4)) {
							a4 = bf;
							a5 = bb
						}
						if (a3.hasNext()) {
							I.setImmediate(function(){
								a8()
							})
						} else {
							aZ.update(a4);
							aV = a5;
							aX(a7 + 1)
						}
					}
				}
			}
		}
		
		function ar(e, aT){
			return (e.type === "blank node" && e.value !== aT ? e.value : null)
		}
		
		function ae(a2, aW, aT, a6, bi, be){
			if (K(a2)) {
				for (var bb = 0; bb < a2.length; ++bb){
					ae(a2[bb], aW, aT, a6, undefined, be)
				}
				return
			}
			if (!aD(a2)) {
				if (be) {
					be.push(a2)
				}
				return
			}
			if (aK(a2)) {
				if ("@type" in a2) {
					var aU = a2["@type"];
					if (aU.indexOf("_:") === 0) {
						a2["@type"] = aU = a6.getName(aU)
					}
				}
				if (be) {
					be.push(a2)
				}
				return
			}
			if ("@type" in a2) {
				var a3 = a2["@type"];
				for (var bb = 0; bb < a3.length; ++bb){
					var aU = a3[bb];
					if (aU.indexOf("_:") === 0) {
						a6.getName(aU)
					}
				}
			}
			if (L(bi)) {
				bi = av(a2) ? a6.getName(a2["@id"]) : a2["@id"]
			}
			if (be) {
				be.push({"@id": bi})
			}
			var a7 = aW[aT];
			var aV = a7[bi] = a7[bi] || {};
			aV["@id"] = bi;
			var aY = Object.keys(a2).sort();
			for (var bg = 0; bg < aY.length; ++bg){
				var aX = aY[bg];
				if (aX === "@id") {
					continue
				}
				if (aX === "@reverse") {
					var aZ = {"@id": bi};
					var a0 = a2["@reverse"];
					for (var bh in a0){
						var a8 = a0[bh];
						for (var a4 = 0; a4 < a8.length; ++a4){
							var bf = a8[a4];
							var bc = bf["@id"];
							if (av(bf)) {
								bc = a6.getName(bc)
							}
							ae(bf, aW, aT, a6, bc);
							I.addValue(a7[bc], bh, aZ, {propertyIsArray: true, allowDuplicate: false})
						}
					}
					continue
				}
				if (aX === "@graph") {
					if (!(bi in aW)) {
						aW[bi] = {}
					}
					var bd = (aT === "@merged") ? aT : bi;
					ae(a2[aX], aW, bd, a6);
					continue
				}
				if (aX !== "@type" && R(aX)) {
					if (aX === "@index" && aX in aV && (a2[aX] !== aV[aX] || a2[aX]["@id"] !== aV[aX]["@id"])) {
						throw new x("Invalid JSON-LD syntax; conflicting @index property detected.", "jsonld.SyntaxError", {
							code: "conflicting indexes",
							subject: aV
						})
					}
					aV[aX] = a2[aX];
					continue
				}
				var e = a2[aX];
				if (aX.indexOf("_:") === 0) {
					aX = a6.getName(aX)
				}
				if (e.length === 0) {
					I.addValue(aV, aX, [], {propertyIsArray: true});
					continue
				}
				for (var a5 = 0; a5 < e.length; ++a5){
					var ba = e[a5];
					if (aX === "@type") {
						ba = (ba.indexOf("_:") === 0) ? a6.getName(ba) : ba
					}
					if (aQ(ba) || ax(ba)) {
						var a9 = av(ba) ? a6.getName(ba["@id"]) : ba["@id"];
						I.addValue(aV, aX, {"@id": a9}, {propertyIsArray: true, allowDuplicate: false});
						ae(ba, aW, aT, a6, a9)
					} else {
						if (y(ba)) {
							var a1 = [];
							ae(ba["@list"], aW, aT, a6, bi, a1);
							ba = {"@list": a1};
							I.addValue(aV, aX, ba, {propertyIsArray: true, allowDuplicate: false})
						} else {
							ae(ba, aW, aT, a6, bi);
							I.addValue(aV, aX, ba, {propertyIsArray: true, allowDuplicate: false})
						}
					}
				}
			}
		}
		
		function ah(aX){
			var a0 = aX["@default"];
			var aW = Object.keys(aX).sort();
			for (var aU = 0; aU < aW.length; ++aU){
				var aV = aW[aU];
				if (aV === "@default") {
					continue
				}
				var aY = aX[aV];
				var aZ = a0[aV];
				if (!aZ) {
					a0[aV] = aZ = {"@id": aV, "@graph": []}
				} else {
					if (!("@graph" in aZ)) {
						aZ["@graph"] = []
					}
				}
				var a2 = aZ["@graph"];
				var e = Object.keys(aY).sort();
				for (var a1 = 0; a1 < e.length; ++a1){
					var aT = aY[e[a1]];
					if (!ax(aT)) {
						a2.push(aT)
					}
				}
			}
			return a0
		}
		
		function O(aX, a7, a4, a3, a1){
			l(a4);
			a4 = a4[0];
			var aW = aX.options;
			var aZ = {
				embed: aN(a4, aW, "embed"),
				explicit: aN(a4, aW, "explicit"),
				requireAll: aN(a4, aW, "requireAll")
			};
			var aT = am(aX, a7, a4, aZ);
			var bc = Object.keys(aT).sort();
			for (var a6 = 0; a6 < bc.length; ++a6){
				var a8 = bc[a6];
				var aY = aT[a8];
				if (aZ.embed === "@link" && a8 in aX.link) {
					p(a3, a1, aX.link[a8]);
					continue
				}
				if (a1 === null) {
					aX.uniqueEmbeds = {}
				}
				var a2 = {};
				a2["@id"] = a8;
				aX.link[a8] = a2;
				if (aZ.embed === "@never" || Q(aY, aX.subjectStack)) {
					p(a3, a1, a2);
					continue
				}
				if (aZ.embed === "@last") {
					if (a8 in aX.uniqueEmbeds) {
						ai(aX, a8)
					}
					aX.uniqueEmbeds[a8] = {parent: a3, property: a1}
				}
				aX.subjectStack.push(aY);
				var aV = Object.keys(aY).sort();
				for (var bd = 0; bd < aV.length; bd++){
					var aU = aV[bd];
					if (R(aU)) {
						a2[aU] = o(aY[aU]);
						continue
					}
					if (aZ.explicit && !(aU in a4)) {
						continue
					}
					var e = aY[aU];
					for (var a5 = 0; a5 < e.length; ++a5){
						var ba = e[a5];
						if (y(ba)) {
							var bf = {"@list": []};
							p(a2, aU, bf);
							var a0 = ba["@list"];
							for (var bb in a0){
								ba = a0[bb];
								if (ax(ba)) {
									var be = (aU in a4 ? a4[aU][0]["@list"] : J(aZ));
									O(aX, [ba["@id"]], be, bf, "@list")
								} else {
									p(bf, "@list", o(ba))
								}
							}
							continue
						}
						if (ax(ba)) {
							var be = (aU in a4 ? a4[aU] : J(aZ));
							O(aX, [ba["@id"]], be, a2, aU)
						} else {
							p(a2, aU, o(ba))
						}
					}
				}
				var aV = Object.keys(a4).sort();
				for (var bd = 0; bd < aV.length; ++bd){
					var aU = aV[bd];
					if (R(aU)) {
						continue
					}
					var a9 = a4[aU][0];
					var bg = aN(a9, aW, "omitDefault");
					if (!bg && !(aU in a2)) {
						var bh = "@null";
						if ("@default" in a9) {
							bh = o(a9["@default"])
						}
						if (!K(bh)) {
							bh = [bh]
						}
						a2[aU] = [{"@preserve": bh}]
					}
				}
				p(a3, a1, a2);
				aX.subjectStack.pop()
			}
		}
		
		function J(e){
			var aU = {};
			for (var aT in e){
				if (e[aT] !== undefined) {
					aU["@" + aT] = [e[aT]]
				}
			}
			return [aU]
		}
		
		function Q(aU, aT){
			for (var e = aT.length - 1; e >= 0; --e){
				if (aT[e]["@id"] === aU["@id"]) {
					return true
				}
			}
			return false
		}
		
		function aN(aW, aU, aT){
			var e = "@" + aT;
			var aV = (e in aW ? aW[e][0] : aU[aT]);
			if (aT === "embed") {
				if (aV === true) {
					aV = "@last"
				} else {
					if (aV === false) {
						aV = "@never"
					} else {
						if (aV !== "@always" && aV !== "@never" && aV !== "@link") {
							aV = "@last"
						}
					}
				}
			}
			return aV
		}
		
		function l(e){
			if (!K(e) || e.length !== 1 || !aD(e[0])) {
				throw new x("Invalid JSON-LD syntax; a JSON-LD frame must be a single object.", "jsonld.SyntaxError", {frame: e})
			}
		}
		
		function am(aW, aT, aY, e){
			var aX = {};
			for (var aV = 0; aV < aT.length; ++aV){
				var aZ = aT[aV];
				var aU = aW.subjects[aZ];
				if (aJ(aU, aY, e)) {
					aX[aZ] = aU
				}
			}
			return aX
		}
		
		function aJ(aZ, e, aT){
			if ("@type" in e && !(e["@type"].length === 1 && aD(e["@type"][0]))) {
				var aY = e["@type"];
				for (var aW = 0; aW < aY.length; ++aW){
					if (I.hasValue(aZ, "@type", aY[aW])) {
						return true
					}
				}
				return false
			}
			var aU = true;
			var aV = false;
			for (var a0 in e){
				if (R(a0)) {
					if (a0 !== "@id" && a0 !== "@type") {
						continue
					}
					aU = false;
					if (a0 === "@id" && aa(e[a0])) {
						if (aZ[a0] !== e[a0]) {
							return false
						}
						aV = true;
						continue
					}
				}
				aU = false;
				if (a0 in aZ) {
					if (K(e[a0]) && e[a0].length === 0 && aZ[a0] !== undefined) {
						return false
					}
					aV = true;
					continue
				}
				var aX = (K(e[a0]) && aD(e[a0][0]) && "@default" in e[a0][0]);
				if (aT.requireAll && !aX) {
					return false
				}
			}
			return aU || aV
		}
		
		function ai(e, aT){
			var aU = e.uniqueEmbeds;
			var aX = aU[aT];
			var a0 = aX.parent;
			var a1 = aX.property;
			var aZ = {"@id": aT};
			if (K(a0)) {
				for (var aW = 0; aW < a0.length; ++aW){
					if (I.compareValues(a0[aW], aZ)) {
						a0[aW] = aZ;
						break
					}
				}
			} else {
				var aY = K(a0[a1]);
				I.removeValue(a0, a1, aZ, {propertyIsArray: aY});
				I.addValue(a0, a1, aZ, {propertyIsArray: aY})
			}
			var aV = function(a5){
				var a4 = Object.keys(aU);
				for (var a2 = 0; a2 < a4.length; ++a2){
					var a3 = a4[a2];
					if (a3 in aU && aD(aU[a3].parent) && aU[a3].parent["@id"] === a5) {
						delete aU[a3];
						aV(a3)
					}
				}
			};
			aV(aT)
		}
		
		function p(aT, aU, e){
			if (aD(aT)) {
				I.addValue(aT, aU, e, {propertyIsArray: true})
			} else {
				aT.push(e)
			}
		}
		
		function w(a0, aX, a1){
			if (K(aX)) {
				var aV = [];
				for (var aW = 0; aW < aX.length; ++aW){
					var a2 = w(a0, aX[aW], a1);
					if (a2 !== null) {
						aV.push(a2)
					}
				}
				aX = aV
			} else {
				if (aD(aX)) {
					if ("@preserve" in aX) {
						if (aX["@preserve"] === "@null") {
							return null
						}
						return aX["@preserve"]
					}
					if (aK(aX)) {
						return aX
					}
					if (y(aX)) {
						aX["@list"] = w(a0, aX["@list"], a1);
						return aX
					}
					var aZ = aI(a0, "@id");
					if (aZ in aX) {
						var aU = aX[aZ];
						if (aU in a1.link) {
							var aY = a1.link[aU].indexOf(aX);
							if (aY === -1) {
								a1.link[aU].push(aX)
							} else {
								return a1.link[aU][aY]
							}
						} else {
							a1.link[aU] = [aX]
						}
					}
					for (var aT in aX){
						var a2 = w(a0, aX[aT], a1);
						var e = I.getContextValue(a0, aT, "@container");
						if (a1.compactArrays && K(a2) && a2.length === 1 && e === null) {
							a2 = a2[0]
						}
						aX[aT] = a2
					}
				}
			}
			return aX
		}
		
		function s(aT, e){
			if (aT.length < e.length) {
				return -1
			}
			if (e.length < aT.length) {
				return 1
			}
			if (aT === e) {
				return 0
			}
			return (aT < e) ? -1 : 1
		}
		
		function aj(a0, aY, a1, aU, a2, aX){
			if (aX === null) {
				aX = "@null"
			}
			var a5 = [];
			if ((aX === "@id" || aX === "@reverse") && ax(a1)) {
				if (aX === "@reverse") {
					a5.push("@reverse")
				}
				var aV = aI(a0, a1["@id"], null, {vocab: true});
				if (aV in a0.mappings && a0.mappings[aV] && a0.mappings[aV]["@id"] === a1["@id"]) {
					a5.push.apply(a5, ["@vocab", "@id"])
				} else {
					a5.push.apply(a5, ["@id", "@vocab"])
				}
			} else {
				a5.push(aX)
			}
			a5.push("@none");
			var aZ = a0.inverse[aY];
			for (var a4 = 0; a4 < aU.length; ++a4){
				var e = aU[a4];
				if (!(e in aZ)) {
					continue
				}
				var aT = aZ[e][a2];
				for (var aW = 0; aW < a5.length; ++aW){
					var a3 = a5[aW];
					if (!(a3 in aT)) {
						continue
					}
					return aT[a3]
				}
			}
			return null
		}
		
		function aI(ba, a4, a5, aV, aZ){
			if (a4 === null) {
				return a4
			}
			if (L(a5)) {
				a5 = null
			}
			if (L(aZ)) {
				aZ = false
			}
			aV = aV || {};
			if (R(a4)) {
				aV.vocab = true
			}
			if (aV.vocab && a4 in ba.getInverse()) {
				var bd = ba["@language"] || "@none";
				var a2 = [];
				if (aD(a5) && "@index" in a5) {
					a2.push("@index")
				}
				var a8 = "@language";
				var a1 = "@null";
				if (aZ) {
					a8 = "@type";
					a1 = "@reverse";
					a2.push("@set")
				} else {
					if (y(a5)) {
						if (!("@index" in a5)) {
							a2.push("@list")
						}
						var bb = a5["@list"];
						var aT = (bb.length === 0) ? bd : null;
						var a6 = null;
						for (var a9 = 0; a9 < bb.length; ++a9){
							var bc = bb[a9];
							var a7 = "@none";
							var be = "@none";
							if (aK(bc)) {
								if ("@language" in bc) {
									a7 = bc["@language"]
								} else {
									if ("@type" in bc) {
										be = bc["@type"]
									} else {
										a7 = "@null"
									}
								}
							} else {
								be = "@id"
							}
							if (aT === null) {
								aT = a7
							} else {
								if (a7 !== aT && aK(bc)) {
									aT = "@none"
								}
							}
							if (a6 === null) {
								a6 = be
							} else {
								if (be !== a6) {
									a6 = "@none"
								}
							}
							if (aT === "@none" && a6 === "@none") {
								break
							}
						}
						aT = aT || "@none";
						a6 = a6 || "@none";
						if (a6 !== "@none") {
							a8 = "@type";
							a1 = a6
						} else {
							a1 = aT
						}
					} else {
						if (aK(a5)) {
							if ("@language" in a5 && !("@index" in a5)) {
								a2.push("@language");
								a1 = a5["@language"]
							} else {
								if ("@type" in a5) {
									a8 = "@type";
									a1 = a5["@type"]
								}
							}
						} else {
							a8 = "@type";
							a1 = "@id"
						}
						a2.push("@set")
					}
				}
				a2.push("@none");
				var a3 = aj(ba, a4, a5, a2, a8, a1);
				if (a3 !== null) {
					return a3
				}
			}
			if (aV.vocab) {
				if ("@vocab" in ba) {
					var e = ba["@vocab"];
					if (a4.indexOf(e) === 0 && a4 !== e) {
						var aU = a4.substr(e.length);
						if (!(aU in ba.mappings)) {
							return aU
						}
					}
				}
			}
			var a0 = null;
			for (var a3 in ba.mappings){
				if (a3.indexOf(":") !== -1) {
					continue
				}
				var aX = ba.mappings[a3];
				if (!aX || aX["@id"] === a4 || a4.indexOf(aX["@id"]) !== 0) {
					continue
				}
				var aW = a3 + ":" + a4.substr(aX["@id"].length);
				var aY = (!(aW in ba.mappings) || (a5 === null && ba.mappings[aW] && ba.mappings[aW]["@id"] === a4));
				if (aY && (a0 === null || s(aW, a0) < 0)) {
					a0 = aW
				}
			}
			if (a0 !== null) {
				return a0
			}
			if (!aV.vocab) {
				return aR(ba["@base"], a4)
			}
			return a4
		}
		
		function aS(a2, a0, a3){
			if (aK(a3)) {
				var aY = I.getContextValue(a2, a0, "@type");
				var aU = I.getContextValue(a2, a0, "@language");
				var e = I.getContextValue(a2, a0, "@container");
				var a5 = (("@index" in a3) && e !== "@index");
				if (!a5) {
					if (a3["@type"] === aY || a3["@language"] === aU) {
						return a3["@value"]
					}
				}
				var aT = Object.keys(a3).length;
				var a1 = (aT === 1 || (aT === 2 && ("@index" in a3) && !a5));
				var aX = ("@language" in a2);
				var aZ = aa(a3["@value"]);
				var aW = (a2.mappings[a0] && a2.mappings[a0]["@language"] === null);
				if (a1 && (!aX || !aZ || aW)) {
					return a3["@value"]
				}
				var aV = {};
				if (a5) {
					aV[aI(a2, "@index")] = a3["@index"]
				}
				if ("@type" in a3) {
					aV[aI(a2, "@type")] = aI(a2, a3["@type"], null, {vocab: true})
				} else {
					if ("@language" in a3) {
						aV[aI(a2, "@language")] = a3["@language"]
					}
				}
				aV[aI(a2, "@value")] = a3["@value"];
				return aV
			}
			var a6 = G(a2, a0, {vocab: true});
			var aY = I.getContextValue(a2, a0, "@type");
			var a4 = aI(a2, a3["@id"], null, {vocab: aY === "@vocab"});
			if (aY === "@id" || aY === "@vocab" || a6 === "@graph") {
				return a4
			}
			var aV = {};
			aV[aI(a2, "@id")] = a4;
			return aV
		}
		
		function r(a3, aY, aV, aW){
			if (aV in aW) {
				if (aW[aV]) {
					return
				}
				throw new x("Cyclical context definition detected.", "jsonld.CyclicalContext", {
					code: "cyclic IRI mapping",
					context: aY,
					term: aV
				})
			}
			aW[aV] = false;
			if (R(aV)) {
				throw new x("Invalid JSON-LD syntax; keywords cannot be overridden.", "jsonld.SyntaxError", {
					code: "keyword redefinition",
					context: aY,
					term: aV
				})
			}
			if (aV === "") {
				throw new x("Invalid JSON-LD syntax; a term cannot be an empty string.", "jsonld.SyntaxError", {
					code: "invalid term definition",
					context: aY
				})
			}
			if (a3.mappings[aV]) {
				delete a3.mappings[aV]
			}
			var a4 = aY[aV];
			if (a4 === null || (aD(a4) && a4["@id"] === null)) {
				a3.mappings[aV] = null;
				aW[aV] = true;
				return
			}
			if (aa(a4)) {
				a4 = {"@id": a4}
			}
			if (!aD(a4)) {
				throw new x("Invalid JSON-LD syntax; @context property values must be strings or objects.", "jsonld.SyntaxError", {
					code: "invalid term definition",
					context: aY
				})
			}
			var e = a3.mappings[aV] = {};
			e.reverse = false;
			if ("@reverse" in a4) {
				if ("@id" in a4) {
					throw new x("Invalid JSON-LD syntax; a @reverse term definition must not contain @id.", "jsonld.SyntaxError", {
						code: "invalid reverse property",
						context: aY
					})
				}
				var a1 = a4["@reverse"];
				if (!aa(a1)) {
					throw new x("Invalid JSON-LD syntax; a @context @reverse value must be a string.", "jsonld.SyntaxError", {
						code: "invalid IRI mapping",
						context: aY
					})
				}
				var aU = G(a3, a1, {vocab: true, base: false}, aY, aW);
				if (!aq(aU)) {
					throw new x("Invalid JSON-LD syntax; a @context @reverse value must be an absolute IRI or a blank node identifier.", "jsonld.SyntaxError", {
						code: "invalid IRI mapping",
						context: aY
					})
				}
				e["@id"] = aU;
				e.reverse = true
			} else {
				if ("@id" in a4) {
					var aU = a4["@id"];
					if (!aa(aU)) {
						throw new x("Invalid JSON-LD syntax; a @context @id value must be an array of strings or a string.", "jsonld.SyntaxError", {
							code: "invalid IRI mapping",
							context: aY
						})
					}
					if (aU !== aV) {
						aU = G(a3, aU, {vocab: true, base: false}, aY, aW);
						if (!aq(aU) && !R(aU)) {
							throw new x("Invalid JSON-LD syntax; a @context @id value must be an absolute IRI, a blank node identifier, or a keyword.", "jsonld.SyntaxError", {
								code: "invalid IRI mapping",
								context: aY
							})
						}
						e["@id"] = aU
					}
				}
			}
			if (!("@id" in e)) {
				var a0 = aV.indexOf(":");
				if (a0 !== -1) {
					var aZ = aV.substr(0, a0);
					if (aZ in aY) {
						r(a3, aY, aZ, aW)
					}
					if (a3.mappings[aZ]) {
						var a5 = aV.substr(a0 + 1);
						e["@id"] = a3.mappings[aZ]["@id"] + a5
					} else {
						e["@id"] = aV
					}
				} else {
					if (!("@vocab" in a3)) {
						throw new x("Invalid JSON-LD syntax; @context terms must define an @id.", "jsonld.SyntaxError", {
							code: "invalid IRI mapping",
							context: aY,
							term: aV
						})
					}
					e["@id"] = a3["@vocab"] + aV
				}
			}
			aW[aV] = true;
			if ("@type" in a4) {
				var a2 = a4["@type"];
				if (!aa(a2)) {
					throw new x("Invalid JSON-LD syntax; an @context @type values must be a string.", "jsonld.SyntaxError", {
						code: "invalid type mapping",
						context: aY
					})
				}
				if (a2 !== "@id" && a2 !== "@vocab") {
					a2 = G(a3, a2, {vocab: true, base: false}, aY, aW);
					if (!aq(a2)) {
						throw new x("Invalid JSON-LD syntax; an @context @type value must be an absolute IRI.", "jsonld.SyntaxError", {
							code: "invalid type mapping",
							context: aY
						})
					}
					if (a2.indexOf("_:") === 0) {
						throw new x("Invalid JSON-LD syntax; an @context @type values must be an IRI, not a blank node identifier.", "jsonld.SyntaxError", {
							code: "invalid type mapping",
							context: aY
						})
					}
				}
				e["@type"] = a2
			}
			if ("@container" in a4) {
				var aT = a4["@container"];
				if (aT !== "@list" && aT !== "@set" && aT !== "@index" && aT !== "@language") {
					throw new x("Invalid JSON-LD syntax; @context @container value must be one of the following: @list, @set, @index, or @language.", "jsonld.SyntaxError", {
						code: "invalid container mapping",
						context: aY
					})
				}
				if (e.reverse && aT !== "@index" && aT !== "@set" && aT !== null) {
					throw new x("Invalid JSON-LD syntax; @context @container value for a @reverse type definition must be @index or @set.", "jsonld.SyntaxError", {
						code: "invalid reverse property",
						context: aY
					})
				}
				e["@container"] = aT
			}
			if ("@language" in a4 && !("@type" in a4)) {
				var aX = a4["@language"];
				if (aX !== null && !aa(aX)) {
					throw new x("Invalid JSON-LD syntax; @context @language value must be a string or null.", "jsonld.SyntaxError", {
						code: "invalid language mapping",
						context: aY
					})
				}
				if (aX !== null) {
					aX = aX.toLowerCase()
				}
				e["@language"] = aX
			}
			var aU = e["@id"];
			if (aU === "@context" || aU === "@preserve") {
				throw new x("Invalid JSON-LD syntax; @context and @preserve cannot be aliased.", "jsonld.SyntaxError", {
					code: "invalid keyword alias",
					context: aY
				})
			}
		}
		
		function G(aZ, a0, aT, aW, aU){
			if (a0 === null || R(a0)) {
				return a0
			}
			a0 = String(a0);
			if (aW && a0 in aW && aU[a0] !== true) {
				r(aZ, aW, a0, aU)
			}
			aT = aT || {};
			if (aT.vocab) {
				var e = aZ.mappings[a0];
				if (e === null) {
					return null
				}
				if (e) {
					return e["@id"]
				}
			}
			var aY = a0.indexOf(":");
			if (aY !== -1) {
				var aX = a0.substr(0, aY);
				var a1 = a0.substr(aY + 1);
				if (aX === "_" || a1.indexOf("//") === 0) {
					return a0
				}
				if (aW && aX in aW) {
					r(aZ, aW, aX, aU)
				}
				var e = aZ.mappings[aX];
				if (e) {
					return e["@id"] + a1
				}
				return a0
			}
			if (aT.vocab && "@vocab" in aZ) {
				return aZ["@vocab"] + a0
			}
			var aV = a0;
			if (aT.base) {
				aV = al(aZ["@base"], aV)
			}
			return aV
		}
		
		function al(aU, aX){
			if (aU === null) {
				return aX
			}
			if (aX.indexOf(":") !== -1) {
				return aX
			}
			if (aa(aU)) {
				aU = I.url.parse(aU || "")
			}
			var e = I.url.parse(aX);
			var aT = {protocol: aU.protocol || ""};
			if (e.authority !== null) {
				aT.authority = e.authority;
				aT.path = e.path;
				aT.query = e.query
			} else {
				aT.authority = aU.authority;
				if (e.path === "") {
					aT.path = aU.path;
					if (e.query !== null) {
						aT.query = e.query
					} else {
						aT.query = aU.query
					}
				} else {
					if (e.path.indexOf("/") === 0) {
						aT.path = e.path
					} else {
						var aW = aU.path;
						if (e.path !== "") {
							aW = aW.substr(0, aW.lastIndexOf("/") + 1);
							if (aW.length > 0 && aW.substr(-1) !== "/") {
								aW += "/"
							}
							aW += e.path
						}
						aT.path = aW
					}
					aT.query = e.query
				}
			}
			aT.path = aE(aT.path, !!aT.authority);
			var aV = aT.protocol;
			if (aT.authority !== null) {
				aV += "//" + aT.authority
			}
			aV += aT.path;
			if (aT.query !== null) {
				aV += "?" + aT.query
			}
			if (e.fragment !== null) {
				aV += "#" + e.fragment
			}
			if (aV === "") {
				aV = "./"
			}
			return aV
		}
		
		function aR(e, aW){
			if (e === null) {
				return aW
			}
			if (aa(e)) {
				e = I.url.parse(e || "")
			}
			var aX = "";
			if (e.href !== "") {
				aX += (e.protocol || "") + "//" + (e.authority || "")
			} else {
				if (aW.indexOf("//")) {
					aX += "//"
				}
			}
			if (aW.indexOf(aX) !== 0) {
				return aW
			}
			var a0 = I.url.parse(aW.substr(aX.length));
			var aV = e.normalizedPath.split("/");
			var aZ = a0.normalizedPath.split("/");
			var aY = (a0.fragment || a0.query) ? 0 : 1;
			while (aV.length > 0 && aZ.length > aY) {
				if (aV[0] !== aZ[0]) {
					break
				}
				aV.shift();
				aZ.shift()
			}
			var aU = "";
			if (aV.length > 0) {
				aV.pop();
				for (var aT = 0; aT < aV.length; ++aT){
					aU += "../"
				}
			}
			aU += aZ.join("/");
			if (a0.query !== null) {
				aU += "?" + a0.query
			}
			if (a0.fragment !== null) {
				aU += "#" + a0.fragment
			}
			if (aU === "") {
				aU = "./"
			}
			return aU
		}
		
		function A(e){
			var aV = I.url.parse(e.base || "");
			return {"@base": aV, mappings: {}, inverse: null, getInverse: aW, clone: aT};
			function aW(){
				var a9 = this;
				if (a9.inverse) {
					return a9.inverse
				}
				var a1 = a9.inverse = {};
				var a7 = a9["@language"] || "@none";
				var a5 = a9.mappings;
				var a3 = Object.keys(a5).sort(s);
				for (var a4 = 0; a4 < a3.length; ++a4){
					var a0 = a3[a4];
					var aY = a5[a0];
					if (aY === null) {
						continue
					}
					var aZ = aY["@container"] || "@none";
					var aX = aY["@id"];
					if (!K(aX)) {
						aX = [aX]
					}
					for (var ba = 0; ba < aX.length; ++ba){
						var a6 = aX[ba];
						var a8 = a1[a6];
						if (!a8) {
							a1[a6] = a8 = {}
						}
						if (!a8[aZ]) {
							a8[aZ] = {"@language": {}, "@type": {}}
						}
						a8 = a8[aZ];
						if (aY.reverse) {
							aU(aY, a0, a8["@type"], "@reverse")
						} else {
							if ("@type" in aY) {
								aU(aY, a0, a8["@type"], aY["@type"])
							} else {
								if ("@language" in aY) {
									var a2 = aY["@language"] || "@null";
									aU(aY, a0, a8["@language"], a2)
								} else {
									aU(aY, a0, a8["@language"], a7);
									aU(aY, a0, a8["@type"], "@none");
									aU(aY, a0, a8["@language"], "@none")
								}
							}
						}
					}
				}
				return a1
			}
			
			function aU(aX, aY, aZ, a0){
				if (!(a0 in aZ)) {
					aZ[a0] = aY
				}
			}
			
			function aT(){
				var aX = {};
				aX["@base"] = this["@base"];
				aX.mappings = o(this.mappings);
				aX.clone = this.clone;
				aX.inverse = null;
				aX.getInverse = this.getInverse;
				if ("@language" in this) {
					aX["@language"] = this["@language"]
				}
				if ("@vocab" in this) {
					aX["@vocab"] = this["@vocab"]
				}
				return aX
			}
		}
		
		function R(e){
			if (!aa(e)) {
				return false
			}
			switch (e) {
				case"@base":
				case"@context":
				case"@container":
				case"@default":
				case"@embed":
				case"@explicit":
				case"@graph":
				case"@id":
				case"@index":
				case"@language":
				case"@list":
				case"@omitDefault":
				case"@preserve":
				case"@requireAll":
				case"@reverse":
				case"@set":
				case"@type":
				case"@value":
				case"@vocab":
					return true
			}
			return false
		}
		
		function aD(e){
			return (Object.prototype.toString.call(e) === "[object Object]")
		}
		
		function az(e){
			return aD(e) && Object.keys(e).length === 0
		}
		
		function K(e){
			return Array.isArray(e)
		}
		
		function P(e){
			if (aa(e) || az(e)) {
				return
			}
			var aU = false;
			if (K(e)) {
				aU = true;
				for (var aT = 0; aT < e.length; ++aT){
					if (!(aa(e[aT]))) {
						aU = false;
						break
					}
				}
			}
			if (!aU) {
				throw new x('Invalid JSON-LD syntax; "@type" value must a string, an array of strings, or an empty object.', "jsonld.SyntaxError", {
					code: "invalid type value",
					value: e
				})
			}
		}
		
		function aa(e){
			return (typeof e === "string" || Object.prototype.toString.call(e) === "[object String]")
		}
		
		function aO(e){
			return (typeof e === "number" || Object.prototype.toString.call(e) === "[object Number]")
		}
		
		function ao(e){
			return aO(e) && String(e).indexOf(".") !== -1
		}
		
		function T(e){
			return !isNaN(parseFloat(e)) && isFinite(e)
		}
		
		function i(e){
			return (typeof e === "boolean" || Object.prototype.toString.call(e) === "[object Boolean]")
		}
		
		function L(e){
			return (typeof e === "undefined")
		}
		
		function aQ(e){
			var aU = false;
			if (aD(e) && !(("@value" in e) || ("@set" in e) || ("@list" in e))) {
				var aT = Object.keys(e).length;
				aU = (aT > 1 || !("@id" in e))
			}
			return aU
		}
		
		function ax(e){
			return (aD(e) && Object.keys(e).length === 1 && ("@id" in e))
		}
		
		function aK(e){
			return aD(e) && ("@value" in e)
		}
		
		function y(e){
			return aD(e) && ("@list" in e)
		}
		
		function av(e){
			var aT = false;
			if (aD(e)) {
				if ("@id" in e) {
					aT = (e["@id"].indexOf("_:") === 0)
				} else {
					aT = (Object.keys(e).length === 0 || !(("@value" in e) || ("@set" in e) || ("@list" in e)))
				}
			}
			return aT
		}
		
		function aq(e){
			return aa(e) && e.indexOf(":") !== -1
		}
		
		function o(aU){
			if (aU && typeof aU === "object") {
				var aV;
				if (K(aU)) {
					aV = [];
					for (var aT = 0; aT < aU.length; ++aT){
						aV[aT] = o(aU[aT])
					}
				} else {
					if (aD(aU)) {
						aV = {};
						for (var e in aU){
							aV[e] = o(aU[e])
						}
					} else {
						aV = aU.toString()
					}
				}
				return aV
			}
			return aU
		}
		
		function F(aZ, aY, aV, e){
			var aX = Object.keys(aY).length;
			if (K(aZ)) {
				for (var aW = 0; aW < aZ.length; ++aW){
					F(aZ[aW], aY, aV, e)
				}
				return (aX < Object.keys(aY).length)
			} else {
				if (aD(aZ)) {
					for (var a0 in aZ){
						if (a0 !== "@context") {
							F(aZ[a0], aY, aV, e);
							continue
						}
						var a1 = aZ[a0];
						if (K(a1)) {
							var aU = a1.length;
							for (var aW = 0; aW < aU; ++aW){
								var aT = a1[aW];
								if (aa(aT)) {
									aT = al(e, aT);
									if (aV) {
										aT = aY[aT];
										if (K(aT)) {
											Array.prototype.splice.apply(a1, [aW, 1].concat(aT));
											aW += aT.length - 1;
											aU = a1.length
										} else {
											a1[aW] = aT
										}
									} else {
										if (!(aT in aY)) {
											aY[aT] = false
										}
									}
								}
							}
						} else {
							if (aa(a1)) {
								a1 = al(e, a1);
								if (aV) {
									aZ[a0] = aY[a1]
								} else {
									if (!(a1 in aY)) {
										aY[a1] = false
									}
								}
							}
						}
					}
					return (aX < Object.keys(aY).length)
				}
			}
			return false
		}
		
		function aM(e, aU, aX){
			var aT = null;
			var aW = aU.documentLoader;
			var aV = function(a6, a1, a7, aZ, a8){
				if (Object.keys(a1).length > ad) {
					aT = new x("Maximum number of @context URLs exceeded.", "jsonld.ContextUrlError", {
						code: "loading remote context failed",
						max: ad
					});
					return a8(aT)
				}
				var a5 = {};
				var a0 = function(){
					F(a6, a5, true, aZ);
					a8(null, a6)
				};
				if (!F(a6, a5, false, aZ)) {
					a0()
				}
				var a3 = [];
				for (var aY in a5){
					if (a5[aY] === false) {
						a3.push(aY)
					}
				}
				var a4 = a3.length;
				for (var a2 = 0; a2 < a3.length; ++a2){
					(function(bb){
						if (bb in a1) {
							aT = new x("Cyclical @context URLs detected.", "jsonld.ContextUrlError", {
								code: "recursive context inclusion",
								url: bb
							});
							return a8(aT)
						}
						var ba = o(a1);
						ba[bb] = true;
						var a9 = function(bf, bg){
							if (aT) {
								return
							}
							var bd = bg ? bg.document : null;
							if (!bf && aa(bd)) {
								try {
									bd = JSON.parse(bd)
								} catch (be) {
									bf = be
								}
							}
							if (bf) {
								bf = new x("Dereferencing a URL did not result in a valid JSON-LD object. Possible causes are an inaccessible URL perhaps due to a same-origin policy (ensure the server uses CORS if you are using client-side JavaScript), too many redirects, a non-JSON response, or more than one HTTP Link Header was provided for a remote context.", "jsonld.InvalidUrl", {
									code: "loading remote context failed",
									url: bb,
									cause: bf
								})
							} else {
								if (!aD(bd)) {
									bf = new x("Dereferencing a URL did not result in a JSON object. The response was valid JSON, but it was not a JSON object.", "jsonld.InvalidUrl", {
										code: "invalid remote context",
										url: bb,
										cause: bf
									})
								}
							}
							if (bf) {
								aT = bf;
								return a8(aT)
							}
							if (!("@context" in bd)) {
								bd = {"@context": {}}
							} else {
								bd = {"@context": bd["@context"]}
							}
							if (bg.contextUrl) {
								if (!K(bd["@context"])) {
									bd["@context"] = [bd["@context"]]
								}
								bd["@context"].push(bg.contextUrl)
							}
							aV(bd, ba, a7, bb, function(bi, bh){
								if (bi) {
									return a8(bi)
								}
								a5[bb] = bh["@context"];
								a4 -= 1;
								if (a4 === 0) {
									a0()
								}
							})
						};
						var bc = a7(bb, a9);
						if (bc && "then" in bc) {
							bc.then(a9.bind(null, null), a9)
						}
					}(a3[a2]))
				}
			};
			aV(e, {}, aW, aU.base, aX)
		}
		
		if (!Object.keys) {
			Object.keys = function(aU){
				if (aU !== Object(aU)) {
					throw new TypeError("Object.keys called on non-object")
				}
				var aT = [];
				for (var e in aU){
					if (Object.prototype.hasOwnProperty.call(aU, e)) {
						aT.push(e)
					}
				}
				return aT
			}
		}
		function U(a5){
			var bc = "(?:<([^:]+:[^>]*)>)";
			var aV = "(_:(?:[A-Za-z0-9]+))";
			var aX = '"([^"\\\\]*(?:\\\\.[^"\\\\]*)*)"';
			var a6 = "(?:\\^\\^" + bc + ")";
			var bd = "(?:@([a-z]+(?:-[a-z0-9]+)*))";
			var be = "(?:" + aX + "(?:" + a6 + "|" + bd + ")?)";
			var aT = "[ \\t]+";
			var a9 = "[ \\t]*";
			var bh = /(?:\r\n)|(?:\n)|(?:\r)/g;
			var a1 = new RegExp("^" + a9 + "$");
			var aY = "(?:" + bc + "|" + aV + ")" + aT;
			var aZ = bc + aT;
			var bi = "(?:" + bc + "|" + aV + "|" + be + ")" + a9;
			var bg = "(?:\\.|(?:(?:" + bc + "|" + aV + ")" + a9 + "\\.))";
			var a2 = new RegExp("^" + a9 + aY + aZ + bi + bg + a9 + "$");
			var a3 = {};
			var e = a5.split(bh);
			var ba = 0;
			for (var a8 = 0; a8 < e.length; ++a8){
				var a4 = e[a8];
				ba++;
				if (a1.test(a4)) {
					continue
				}
				var a0 = a4.match(a2);
				if (a0 === null) {
					throw new x("Error while parsing N-Quads; invalid quad.", "jsonld.ParseError", {line: ba})
				}
				var bf = {};
				if (!L(a0[1])) {
					bf.subject = {type: "IRI", value: a0[1]}
				} else {
					bf.subject = {type: "blank node", value: a0[2]}
				}
				bf.predicate = {type: "IRI", value: a0[3]};
				if (!L(a0[4])) {
					bf.object = {type: "IRI", value: a0[4]}
				} else {
					if (!L(a0[5])) {
						bf.object = {type: "blank node", value: a0[5]}
					} else {
						bf.object = {type: "literal"};
						if (!L(a0[7])) {
							bf.object.datatype = a0[7]
						} else {
							if (!L(a0[8])) {
								bf.object.datatype = u;
								bf.object.language = a0[8]
							} else {
								bf.object.datatype = z
							}
						}
						var a7 = a0[6].replace(/\\"/g, '"').replace(/\\t/g, "\t").replace(/\\n/g, "\n").replace(/\\r/g, "\r").replace(/\\\\/g, "\\");
						bf.object.value = a7
					}
				}
				var bj = "@default";
				if (!L(a0[9])) {
					bj = a0[9]
				} else {
					if (!L(a0[10])) {
						bj = a0[10]
					}
				}
				if (!(bj in a3)) {
					a3[bj] = [bf]
				} else {
					var aU = true;
					var bb = a3[bj];
					for (var aW = 0; aU && aW < bb.length; ++aW){
						if (q(bb[aW], bf)) {
							aU = false
						}
					}
					if (aU) {
						bb.push(bf)
					}
				}
			}
			return a3
		}
		
		I.registerRDFParser("application/nquads", U);
		function aL(aV){
			var e = [];
			for (var aT in aV){
				var aX = aV[aT];
				for (var aU = 0; aU < aX.length; ++aU){
					var aW = aX[aU];
					if (aT === "@default") {
						aT = null
					}
					e.push(Y(aW, aT))
				}
			}
			e.sort();
			return e.join("")
		}
		
		function Y(aX, aV, aY){
			var a0 = aX.subject;
			var aT = aX.predicate;
			var aU = aX.object;
			var aW = aV;
			var aZ = "";
			if (a0.type === "IRI") {
				aZ += "<" + a0.value + ">"
			} else {
				if (aY) {
					aZ += (a0.value === aY) ? "_:a" : "_:z"
				} else {
					aZ += a0.value
				}
			}
			aZ += " ";
			if (aT.type === "IRI") {
				aZ += "<" + aT.value + ">"
			} else {
				if (aY) {
					aZ += "_:p"
				} else {
					aZ += aT.value
				}
			}
			aZ += " ";
			if (aU.type === "IRI") {
				aZ += "<" + aU.value + ">"
			} else {
				if (aU.type === "blank node") {
					if (aY) {
						aZ += (aU.value === aY) ? "_:a" : "_:z"
					} else {
						aZ += aU.value
					}
				} else {
					var e = aU.value.replace(/\\/g, "\\\\").replace(/\t/g, "\\t").replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\"/g, '\\"');
					aZ += '"' + e + '"';
					if (aU.datatype === u) {
						if (aU.language) {
							aZ += "@" + aU.language
						}
					} else {
						if (aU.datatype !== z) {
							aZ += "^^<" + aU.datatype + ">"
						}
					}
				}
			}
			if (aW !== null) {
				if (aW.indexOf("_:") !== 0) {
					aZ += " <" + aW + ">"
				} else {
					if (aY) {
						aZ += " _:g"
					} else {
						aZ += " " + aW
					}
				}
			}
			aZ += " .\n";
			return aZ
		}
		
		function V(aU){
			var aT = {};
			aT["@default"] = [];
			var aW = aU.getSubjects();
			for (var aV = 0; aV < aW.length; ++aV){
				var aY = aW[aV];
				if (aY === null) {
					continue
				}
				var a5 = aU.getSubjectTriples(aY);
				if (a5 === null) {
					continue
				}
				var a3 = a5.predicates;
				for (var a4 in a3){
					var a6 = a3[a4].objects;
					for (var a2 = 0; a2 < a6.length; ++a2){
						var e = a6[a2];
						var aX = {};
						if (aY.indexOf("_:") === 0) {
							aX.subject = {type: "blank node", value: aY}
						} else {
							aX.subject = {type: "IRI", value: aY}
						}
						if (a4.indexOf("_:") === 0) {
							aX.predicate = {type: "blank node", value: a4}
						} else {
							aX.predicate = {type: "IRI", value: a4}
						}
						var a1 = e.value;
						if (e.type === C) {
							if (!E) {
								aw()
							}
							var a0 = new E();
							a1 = "";
							for (var aZ = 0; aZ < e.value.length; aZ++){
								if (e.value[aZ].nodeType === ay.ELEMENT_NODE) {
									a1 += a0.serializeToString(e.value[aZ])
								} else {
									if (e.value[aZ].nodeType === ay.TEXT_NODE) {
										a1 += e.value[aZ].nodeValue
									}
								}
							}
						}
						aX.object = {};
						if (e.type === N) {
							if (e.value.indexOf("_:") === 0) {
								aX.object.type = "blank node"
							} else {
								aX.object.type = "IRI"
							}
						} else {
							aX.object.type = "literal";
							if (e.type === af) {
								if (e.language) {
									aX.object.datatype = u;
									aX.object.language = e.language
								} else {
									aX.object.datatype = z
								}
							} else {
								aX.object.datatype = e.type
							}
						}
						aX.object.value = a1;
						aT["@default"].push(aX)
					}
				}
			}
			return aT
		}
		
		I.registerRDFParser("rdfa-api", V);
		function j(e){
			this.prefix = e;
			this.counter = 0;
			this.existing = {}
		}
		
		I.UniqueNamer = j;
		j.prototype.clone = function(){
			var e = new j(this.prefix);
			e.counter = this.counter;
			e.existing = o(this.existing);
			return e
		};
		j.prototype.getName = function(aT){
			if (aT && aT in this.existing) {
				return this.existing[aT]
			}
			var e = this.prefix + this.counter;
			this.counter += 1;
			if (aT) {
				this.existing[aT] = e
			}
			return e
		};
		j.prototype.isNamed = function(e){
			return (e in this.existing)
		};
		var n = function(aT){
			this.list = aT.sort();
			this.done = false;
			this.left = {};
			for (var e = 0; e < aT.length; ++e){
				this.left[aT[e]] = true
			}
		};
		n.prototype.hasNext = function(){
			return !this.done
		};
		n.prototype.next = function(){
			var aY = this.list.slice();
			var e = null;
			var aZ = 0;
			var aV = this.list.length;
			for (var aU = 0; aU < aV; ++aU){
				var aT = this.list[aU];
				var aX = this.left[aT];
				if ((e === null || aT > e) && ((aX && aU > 0 && aT > this.list[aU - 1]) || (!aX && aU < (aV - 1) && aT > this.list[aU + 1]))) {
					e = aT;
					aZ = aU
				}
			}
			if (e === null) {
				this.done = true
			} else {
				var aW = this.left[e] ? aZ - 1 : aZ + 1;
				this.list[aZ] = this.list[aW];
				this.list[aW] = e;
				for (var aU = 0; aU < aV; ++aU){
					if (this.list[aU] > e) {
						this.left[this.list[aU]] = !this.left[this.list[aU]]
					}
				}
			}
			return aY
		};
		var au = I.sha1 = {};
		if (c) {
			var v = require("crypto");
			au.create = function(){
				var e = v.createHash("sha1");
				return {
					update: function(aT){
						e.update(aT, "utf8")
					}, digest: function(){
						return e.digest("hex")
					}
				}
			}
		} else {
			au.create = function(){
				return new au.MessageDigest()
			}
		}
		au.hash = function(e){
			var aU = au.create();
			for (var aT = 0; aT < e.length; ++aT){
				aU.update(e[aT])
			}
			return aU.digest()
		};
		if (!c) {
			au.Buffer = function(){
				this.data = "";
				this.read = 0
			};
			au.Buffer.prototype.putInt32 = function(e){
				this.data += (String.fromCharCode(e >> 24 & 255) + String.fromCharCode(e >> 16 & 255) + String.fromCharCode(e >> 8 & 255) + String.fromCharCode(e & 255))
			};
			au.Buffer.prototype.getInt32 = function(){
				var e = (this.data.charCodeAt(this.read) << 24 ^ this.data.charCodeAt(this.read + 1) << 16 ^ this.data.charCodeAt(this.read + 2) << 8 ^ this.data.charCodeAt(this.read + 3));
				this.read += 4;
				return e
			};
			au.Buffer.prototype.bytes = function(){
				return this.data.slice(this.read)
			};
			au.Buffer.prototype.length = function(){
				return this.data.length - this.read
			};
			au.Buffer.prototype.compact = function(){
				this.data = this.data.slice(this.read);
				this.read = 0
			};
			au.Buffer.prototype.toHex = function(){
				var aU = "";
				for (var aT = this.read; aT < this.data.length; ++aT){
					var e = this.data.charCodeAt(aT);
					if (e < 16) {
						aU += "0"
					}
					aU += e.toString(16)
				}
				return aU
			};
			au.MessageDigest = function(){
				if (!aB.initialized) {
					aB.init()
				}
				this.blockLength = 64;
				this.digestLength = 20;
				this.messageLength = 0;
				this.input = new au.Buffer();
				this.words = new Array(80);
				this.state = {h0: 1732584193, h1: 4023233417, h2: 2562383102, h3: 271733878, h4: 3285377520}
			};
			au.MessageDigest.prototype.update = function(e){
				e = unescape(encodeURIComponent(e));
				this.messageLength += e.length;
				this.input.data += e;
				aB.update(this.state, this.words, this.input);
				if (this.input.read > 2048 || this.input.length() === 0) {
					this.input.compact()
				}
			};
			au.MessageDigest.prototype.digest = function(){
				var e = this.messageLength;
				var aU = new au.Buffer();
				aU.data += this.input.bytes();
				aU.data += aB.padding.substr(0, 64 - ((e + 8) % 64));
				aU.putInt32((e >>> 29) & 255);
				aU.putInt32((e << 3) & 4294967295);
				aB.update(this.state, this.words, aU);
				var aT = new au.Buffer();
				aT.putInt32(this.state.h0);
				aT.putInt32(this.state.h1);
				aT.putInt32(this.state.h2);
				aT.putInt32(this.state.h3);
				aT.putInt32(this.state.h4);
				return aT.toHex()
			};
			var aB = {padding: null, initialized: false};
			aB.init = function(){
				aB.padding = String.fromCharCode(128);
				var aT = String.fromCharCode(0);
				var e = 64;
				while (e > 0) {
					if (e & 1) {
						aB.padding += aT
					}
					e >>>= 1;
					if (e > 0) {
						aT += aT
					}
				}
				aB.initialized = true
			};
			aB.update = function(a4, a2, a0){
				var a3, a1, aZ, aY, aX, aW, aV, aT;
				var aU = a0.length();
				while (aU >= 64) {
					a1 = a4.h0;
					aZ = a4.h1;
					aY = a4.h2;
					aX = a4.h3;
					aW = a4.h4;
					for (aT = 0; aT < 16; ++aT){
						a3 = a0.getInt32();
						a2[aT] = a3;
						aV = aX ^ (aZ & (aY ^ aX));
						a3 = ((a1 << 5) | (a1 >>> 27)) + aV + aW + 1518500249 + a3;
						aW = aX;
						aX = aY;
						aY = (aZ << 30) | (aZ >>> 2);
						aZ = a1;
						a1 = a3
					}
					for (; aT < 20; ++aT){
						a3 = (a2[aT - 3] ^ a2[aT - 8] ^ a2[aT - 14] ^ a2[aT - 16]);
						a3 = (a3 << 1) | (a3 >>> 31);
						a2[aT] = a3;
						aV = aX ^ (aZ & (aY ^ aX));
						a3 = ((a1 << 5) | (a1 >>> 27)) + aV + aW + 1518500249 + a3;
						aW = aX;
						aX = aY;
						aY = (aZ << 30) | (aZ >>> 2);
						aZ = a1;
						a1 = a3
					}
					for (; aT < 32; ++aT){
						a3 = (a2[aT - 3] ^ a2[aT - 8] ^ a2[aT - 14] ^ a2[aT - 16]);
						a3 = (a3 << 1) | (a3 >>> 31);
						a2[aT] = a3;
						aV = aZ ^ aY ^ aX;
						a3 = ((a1 << 5) | (a1 >>> 27)) + aV + aW + 1859775393 + a3;
						aW = aX;
						aX = aY;
						aY = (aZ << 30) | (aZ >>> 2);
						aZ = a1;
						a1 = a3
					}
					for (; aT < 40; ++aT){
						a3 = (a2[aT - 6] ^ a2[aT - 16] ^ a2[aT - 28] ^ a2[aT - 32]);
						a3 = (a3 << 2) | (a3 >>> 30);
						a2[aT] = a3;
						aV = aZ ^ aY ^ aX;
						a3 = ((a1 << 5) | (a1 >>> 27)) + aV + aW + 1859775393 + a3;
						aW = aX;
						aX = aY;
						aY = (aZ << 30) | (aZ >>> 2);
						aZ = a1;
						a1 = a3
					}
					for (; aT < 60; ++aT){
						a3 = (a2[aT - 6] ^ a2[aT - 16] ^ a2[aT - 28] ^ a2[aT - 32]);
						a3 = (a3 << 2) | (a3 >>> 30);
						a2[aT] = a3;
						aV = (aZ & aY) | (aX & (aZ ^ aY));
						a3 = ((a1 << 5) | (a1 >>> 27)) + aV + aW + 2400959708 + a3;
						aW = aX;
						aX = aY;
						aY = (aZ << 30) | (aZ >>> 2);
						aZ = a1;
						a1 = a3
					}
					for (; aT < 80; ++aT){
						a3 = (a2[aT - 6] ^ a2[aT - 16] ^ a2[aT - 28] ^ a2[aT - 32]);
						a3 = (a3 << 2) | (a3 >>> 30);
						a2[aT] = a3;
						aV = aZ ^ aY ^ aX;
						a3 = ((a1 << 5) | (a1 >>> 27)) + aV + aW + 3395469782 + a3;
						aW = aX;
						aX = aY;
						aY = (aZ << 30) | (aZ >>> 2);
						aZ = a1;
						a1 = a3
					}
					a4.h0 += a1;
					a4.h1 += aZ;
					a4.h2 += aY;
					a4.h3 += aX;
					a4.h4 += aW;
					aU -= 64
				}
			}
		}
		if (!E) {
			var aw = function(){
				E = require("xmldom").XMLSerializer
			}
		}
		I.url = {};
		I.url.parsers = {
			simple: {
				keys: ["href", "scheme", "authority", "path", "query", "fragment"],
				regex: /^(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*)(?:\?([^#]*))?(?:#(.*))?/
			},
			full: {
				keys: ["href", "protocol", "scheme", "authority", "auth", "user", "password", "hostname", "port", "path", "directory", "file", "query", "fragment"],
				regex: /^(([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?(?:(((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/
			}
		};
		I.url.parse = function(aW, aX){
			var aT = {};
			var aV = I.url.parsers[aX || "full"];
			var e = aV.regex.exec(aW);
			var aU = aV.keys.length;
			while (aU--) {
				aT[aV.keys[aU]] = (e[aU] === undefined) ? null : e[aU]
			}
			aT.normalizedPath = aE(aT.path, !!aT.authority);
			return aT
		};
		function aE(aW, aU){
			var aV = "";
			if (aW.indexOf("/") === 0) {
				aV = "/"
			}
			var aT = aW.split("/");
			var e = [];
			while (aT.length > 0) {
				if (aT[0] === "." || (aT[0] === "" && aT.length > 1)) {
					aT.shift();
					continue
				}
				if (aT[0] === "..") {
					aT.shift();
					if (aU || (e.length > 0 && e[e.length - 1] !== "..")) {
						e.pop()
					} else {
						e.push("..")
					}
					continue
				}
				e.push(aT.shift())
			}
			return aV + e.join("/")
		}
		
		if (c) {
			I.useDocumentLoader("node")
		} else {
			if (typeof XMLHttpRequest !== "undefined") {
				I.useDocumentLoader("xhr")
			}
		}
		if (c) {
			I.use = function(e){
				switch (e) {
					case"request":
						I.request = require("./request");
						break;
					default:
						throw new x("Unknown extension.", "jsonld.UnknownExtension", {extension: e})
				}
			};
			var k = {exports: {}, filename: __dirname};
			require("pkginfo")(k, "version");
			I.version = k.exports.version
		}
		return I
	};
	var b = function(){
		return d(function(){
			return b()
		})
	};
	if (!c && (typeof define === "function" && define.amd)) {
		define([], function(){
			d(b);
			return b
		})
	} else {
		d(b);
		if (typeof require === "function" && typeof module !== "undefined" && module.exports) {
			module.exports = b
		}
		if (a) {
			if (typeof jsonld === "undefined") {
				jsonld = jsonldjs = b
			} else {
				jsonldjs = b
			}
		}
	}
	return b
})();