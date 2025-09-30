import {
    Cell,
    Slice,
    Address,
    Builder,
    beginCell,
    ComputeError,
    TupleItem,
    TupleReader,
    Dictionary,
    contractAddress,
    address,
    ContractProvider,
    Sender,
    Contract,
    ContractABI,
    ABIType,
    ABIGetter,
    ABIReceiver,
    TupleBuilder,
    DictionaryValue
} from '@ton/core';

export type DataSize = {
    $$type: 'DataSize';
    cells: bigint;
    bits: bigint;
    refs: bigint;
}

export function storeDataSize(src: DataSize) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.cells, 257);
        b_0.storeInt(src.bits, 257);
        b_0.storeInt(src.refs, 257);
    };
}

export function loadDataSize(slice: Slice) {
    const sc_0 = slice;
    const _cells = sc_0.loadIntBig(257);
    const _bits = sc_0.loadIntBig(257);
    const _refs = sc_0.loadIntBig(257);
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function loadGetterTupleDataSize(source: TupleReader) {
    const _cells = source.readBigNumber();
    const _bits = source.readBigNumber();
    const _refs = source.readBigNumber();
    return { $$type: 'DataSize' as const, cells: _cells, bits: _bits, refs: _refs };
}

export function storeTupleDataSize(source: DataSize) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.cells);
    builder.writeNumber(source.bits);
    builder.writeNumber(source.refs);
    return builder.build();
}

export function dictValueParserDataSize(): DictionaryValue<DataSize> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDataSize(src)).endCell());
        },
        parse: (src) => {
            return loadDataSize(src.loadRef().beginParse());
        }
    }
}

export type SignedBundle = {
    $$type: 'SignedBundle';
    signature: Buffer;
    signedData: Slice;
}

export function storeSignedBundle(src: SignedBundle) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBuffer(src.signature);
        b_0.storeBuilder(src.signedData.asBuilder());
    };
}

export function loadSignedBundle(slice: Slice) {
    const sc_0 = slice;
    const _signature = sc_0.loadBuffer(64);
    const _signedData = sc_0;
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function loadGetterTupleSignedBundle(source: TupleReader) {
    const _signature = source.readBuffer();
    const _signedData = source.readCell().asSlice();
    return { $$type: 'SignedBundle' as const, signature: _signature, signedData: _signedData };
}

export function storeTupleSignedBundle(source: SignedBundle) {
    const builder = new TupleBuilder();
    builder.writeBuffer(source.signature);
    builder.writeSlice(source.signedData.asCell());
    return builder.build();
}

export function dictValueParserSignedBundle(): DictionaryValue<SignedBundle> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSignedBundle(src)).endCell());
        },
        parse: (src) => {
            return loadSignedBundle(src.loadRef().beginParse());
        }
    }
}

export type StateInit = {
    $$type: 'StateInit';
    code: Cell;
    data: Cell;
}

export function storeStateInit(src: StateInit) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeRef(src.code);
        b_0.storeRef(src.data);
    };
}

export function loadStateInit(slice: Slice) {
    const sc_0 = slice;
    const _code = sc_0.loadRef();
    const _data = sc_0.loadRef();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function loadGetterTupleStateInit(source: TupleReader) {
    const _code = source.readCell();
    const _data = source.readCell();
    return { $$type: 'StateInit' as const, code: _code, data: _data };
}

export function storeTupleStateInit(source: StateInit) {
    const builder = new TupleBuilder();
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserStateInit(): DictionaryValue<StateInit> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStateInit(src)).endCell());
        },
        parse: (src) => {
            return loadStateInit(src.loadRef().beginParse());
        }
    }
}

export type Context = {
    $$type: 'Context';
    bounceable: boolean;
    sender: Address;
    value: bigint;
    raw: Slice;
}

export function storeContext(src: Context) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeBit(src.bounceable);
        b_0.storeAddress(src.sender);
        b_0.storeInt(src.value, 257);
        b_0.storeRef(src.raw.asCell());
    };
}

export function loadContext(slice: Slice) {
    const sc_0 = slice;
    const _bounceable = sc_0.loadBit();
    const _sender = sc_0.loadAddress();
    const _value = sc_0.loadIntBig(257);
    const _raw = sc_0.loadRef().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function loadGetterTupleContext(source: TupleReader) {
    const _bounceable = source.readBoolean();
    const _sender = source.readAddress();
    const _value = source.readBigNumber();
    const _raw = source.readCell().asSlice();
    return { $$type: 'Context' as const, bounceable: _bounceable, sender: _sender, value: _value, raw: _raw };
}

export function storeTupleContext(source: Context) {
    const builder = new TupleBuilder();
    builder.writeBoolean(source.bounceable);
    builder.writeAddress(source.sender);
    builder.writeNumber(source.value);
    builder.writeSlice(source.raw.asCell());
    return builder.build();
}

export function dictValueParserContext(): DictionaryValue<Context> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeContext(src)).endCell());
        },
        parse: (src) => {
            return loadContext(src.loadRef().beginParse());
        }
    }
}

export type SendParameters = {
    $$type: 'SendParameters';
    mode: bigint;
    body: Cell | null;
    code: Cell | null;
    data: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeSendParameters(src: SendParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        if (src.code !== null && src.code !== undefined) { b_0.storeBit(true).storeRef(src.code); } else { b_0.storeBit(false); }
        if (src.data !== null && src.data !== undefined) { b_0.storeBit(true).storeRef(src.data); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadSendParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _code = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _data = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleSendParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _code = source.readCellOpt();
    const _data = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'SendParameters' as const, mode: _mode, body: _body, code: _code, data: _data, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleSendParameters(source: SendParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeCell(source.code);
    builder.writeCell(source.data);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserSendParameters(): DictionaryValue<SendParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeSendParameters(src)).endCell());
        },
        parse: (src) => {
            return loadSendParameters(src.loadRef().beginParse());
        }
    }
}

export type MessageParameters = {
    $$type: 'MessageParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    to: Address;
    bounce: boolean;
}

export function storeMessageParameters(src: MessageParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeAddress(src.to);
        b_0.storeBit(src.bounce);
    };
}

export function loadMessageParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _to = sc_0.loadAddress();
    const _bounce = sc_0.loadBit();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function loadGetterTupleMessageParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _to = source.readAddress();
    const _bounce = source.readBoolean();
    return { $$type: 'MessageParameters' as const, mode: _mode, body: _body, value: _value, to: _to, bounce: _bounce };
}

export function storeTupleMessageParameters(source: MessageParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeAddress(source.to);
    builder.writeBoolean(source.bounce);
    return builder.build();
}

export function dictValueParserMessageParameters(): DictionaryValue<MessageParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeMessageParameters(src)).endCell());
        },
        parse: (src) => {
            return loadMessageParameters(src.loadRef().beginParse());
        }
    }
}

export type DeployParameters = {
    $$type: 'DeployParameters';
    mode: bigint;
    body: Cell | null;
    value: bigint;
    bounce: boolean;
    init: StateInit;
}

export function storeDeployParameters(src: DeployParameters) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.mode, 257);
        if (src.body !== null && src.body !== undefined) { b_0.storeBit(true).storeRef(src.body); } else { b_0.storeBit(false); }
        b_0.storeInt(src.value, 257);
        b_0.storeBit(src.bounce);
        b_0.store(storeStateInit(src.init));
    };
}

export function loadDeployParameters(slice: Slice) {
    const sc_0 = slice;
    const _mode = sc_0.loadIntBig(257);
    const _body = sc_0.loadBit() ? sc_0.loadRef() : null;
    const _value = sc_0.loadIntBig(257);
    const _bounce = sc_0.loadBit();
    const _init = loadStateInit(sc_0);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function loadGetterTupleDeployParameters(source: TupleReader) {
    const _mode = source.readBigNumber();
    const _body = source.readCellOpt();
    const _value = source.readBigNumber();
    const _bounce = source.readBoolean();
    const _init = loadGetterTupleStateInit(source);
    return { $$type: 'DeployParameters' as const, mode: _mode, body: _body, value: _value, bounce: _bounce, init: _init };
}

export function storeTupleDeployParameters(source: DeployParameters) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.mode);
    builder.writeCell(source.body);
    builder.writeNumber(source.value);
    builder.writeBoolean(source.bounce);
    builder.writeTuple(storeTupleStateInit(source.init));
    return builder.build();
}

export function dictValueParserDeployParameters(): DictionaryValue<DeployParameters> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployParameters(src)).endCell());
        },
        parse: (src) => {
            return loadDeployParameters(src.loadRef().beginParse());
        }
    }
}

export type StdAddress = {
    $$type: 'StdAddress';
    workchain: bigint;
    address: bigint;
}

export function storeStdAddress(src: StdAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 8);
        b_0.storeUint(src.address, 256);
    };
}

export function loadStdAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(8);
    const _address = sc_0.loadUintBig(256);
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleStdAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readBigNumber();
    return { $$type: 'StdAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleStdAddress(source: StdAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeNumber(source.address);
    return builder.build();
}

export function dictValueParserStdAddress(): DictionaryValue<StdAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStdAddress(src)).endCell());
        },
        parse: (src) => {
            return loadStdAddress(src.loadRef().beginParse());
        }
    }
}

export type VarAddress = {
    $$type: 'VarAddress';
    workchain: bigint;
    address: Slice;
}

export function storeVarAddress(src: VarAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeInt(src.workchain, 32);
        b_0.storeRef(src.address.asCell());
    };
}

export function loadVarAddress(slice: Slice) {
    const sc_0 = slice;
    const _workchain = sc_0.loadIntBig(32);
    const _address = sc_0.loadRef().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function loadGetterTupleVarAddress(source: TupleReader) {
    const _workchain = source.readBigNumber();
    const _address = source.readCell().asSlice();
    return { $$type: 'VarAddress' as const, workchain: _workchain, address: _address };
}

export function storeTupleVarAddress(source: VarAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.workchain);
    builder.writeSlice(source.address.asCell());
    return builder.build();
}

export function dictValueParserVarAddress(): DictionaryValue<VarAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeVarAddress(src)).endCell());
        },
        parse: (src) => {
            return loadVarAddress(src.loadRef().beginParse());
        }
    }
}

export type BasechainAddress = {
    $$type: 'BasechainAddress';
    hash: bigint | null;
}

export function storeBasechainAddress(src: BasechainAddress) {
    return (builder: Builder) => {
        const b_0 = builder;
        if (src.hash !== null && src.hash !== undefined) { b_0.storeBit(true).storeInt(src.hash, 257); } else { b_0.storeBit(false); }
    };
}

export function loadBasechainAddress(slice: Slice) {
    const sc_0 = slice;
    const _hash = sc_0.loadBit() ? sc_0.loadIntBig(257) : null;
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function loadGetterTupleBasechainAddress(source: TupleReader) {
    const _hash = source.readBigNumberOpt();
    return { $$type: 'BasechainAddress' as const, hash: _hash };
}

export function storeTupleBasechainAddress(source: BasechainAddress) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.hash);
    return builder.build();
}

export function dictValueParserBasechainAddress(): DictionaryValue<BasechainAddress> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeBasechainAddress(src)).endCell());
        },
        parse: (src) => {
            return loadBasechainAddress(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwner = {
    $$type: 'ChangeOwner';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwner(src: ChangeOwner) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2174598809, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwner(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2174598809) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadTupleChangeOwner(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadGetterTupleChangeOwner(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwner' as const, queryId: _queryId, newOwner: _newOwner };
}

export function storeTupleChangeOwner(source: ChangeOwner) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

export function dictValueParserChangeOwner(): DictionaryValue<ChangeOwner> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwner(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwner(src.loadRef().beginParse());
        }
    }
}

export type ChangeOwnerOk = {
    $$type: 'ChangeOwnerOk';
    queryId: bigint;
    newOwner: Address;
}

export function storeChangeOwnerOk(src: ChangeOwnerOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(846932810, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.newOwner);
    };
}

export function loadChangeOwnerOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 846932810) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _newOwner = sc_0.loadAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadTupleChangeOwnerOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

export function loadGetterTupleChangeOwnerOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _newOwner = source.readAddress();
    return { $$type: 'ChangeOwnerOk' as const, queryId: _queryId, newOwner: _newOwner };
}

export function storeTupleChangeOwnerOk(source: ChangeOwnerOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.newOwner);
    return builder.build();
}

export function dictValueParserChangeOwnerOk(): DictionaryValue<ChangeOwnerOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeChangeOwnerOk(src)).endCell());
        },
        parse: (src) => {
            return loadChangeOwnerOk(src.loadRef().beginParse());
        }
    }
}

export type Deploy = {
    $$type: 'Deploy';
    queryId: bigint;
}

export function storeDeploy(src: Deploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2490013878, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2490013878) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function loadGetterTupleDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'Deploy' as const, queryId: _queryId };
}

export function storeTupleDeploy(source: Deploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeploy(): DictionaryValue<Deploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployOk = {
    $$type: 'DeployOk';
    queryId: bigint;
}

export function storeDeployOk(src: DeployOk) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2952335191, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadDeployOk(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2952335191) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function loadGetterTupleDeployOk(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'DeployOk' as const, queryId: _queryId };
}

export function storeTupleDeployOk(source: DeployOk) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserDeployOk(): DictionaryValue<DeployOk> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployOk(src)).endCell());
        },
        parse: (src) => {
            return loadDeployOk(src.loadRef().beginParse());
        }
    }
}

export type FactoryDeploy = {
    $$type: 'FactoryDeploy';
    queryId: bigint;
    cashback: Address;
}

export function storeFactoryDeploy(src: FactoryDeploy) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1829761339, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.cashback);
    };
}

export function loadFactoryDeploy(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1829761339) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _cashback = sc_0.loadAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function loadGetterTupleFactoryDeploy(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _cashback = source.readAddress();
    return { $$type: 'FactoryDeploy' as const, queryId: _queryId, cashback: _cashback };
}

export function storeTupleFactoryDeploy(source: FactoryDeploy) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.cashback);
    return builder.build();
}

export function dictValueParserFactoryDeploy(): DictionaryValue<FactoryDeploy> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeFactoryDeploy(src)).endCell());
        },
        parse: (src) => {
            return loadFactoryDeploy(src.loadRef().beginParse());
        }
    }
}

export type DeployEpoch = {
    $$type: 'DeployEpoch';
    totalToncastStaked: bigint;
}

export function storeDeployEpoch(src: DeployEpoch) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1517661758, 32);
        b_0.storeCoins(src.totalToncastStaked);
    };
}

export function loadDeployEpoch(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1517661758) { throw Error('Invalid prefix'); }
    const _totalToncastStaked = sc_0.loadCoins();
    return { $$type: 'DeployEpoch' as const, totalToncastStaked: _totalToncastStaked };
}

export function loadTupleDeployEpoch(source: TupleReader) {
    const _totalToncastStaked = source.readBigNumber();
    return { $$type: 'DeployEpoch' as const, totalToncastStaked: _totalToncastStaked };
}

export function loadGetterTupleDeployEpoch(source: TupleReader) {
    const _totalToncastStaked = source.readBigNumber();
    return { $$type: 'DeployEpoch' as const, totalToncastStaked: _totalToncastStaked };
}

export function storeTupleDeployEpoch(source: DeployEpoch) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.totalToncastStaked);
    return builder.build();
}

export function dictValueParserDeployEpoch(): DictionaryValue<DeployEpoch> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDeployEpoch(src)).endCell());
        },
        parse: (src) => {
            return loadDeployEpoch(src.loadRef().beginParse());
        }
    }
}

export type PayoutStaker = {
    $$type: 'PayoutStaker';
    queryId: bigint;
    stakerAddress: Address;
    stakerToncastAmount: bigint;
}

export function storePayoutStaker(src: PayoutStaker) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(983256866, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.stakerAddress);
        b_0.storeCoins(src.stakerToncastAmount);
    };
}

export function loadPayoutStaker(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 983256866) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _stakerAddress = sc_0.loadAddress();
    const _stakerToncastAmount = sc_0.loadCoins();
    return { $$type: 'PayoutStaker' as const, queryId: _queryId, stakerAddress: _stakerAddress, stakerToncastAmount: _stakerToncastAmount };
}

export function loadTuplePayoutStaker(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _stakerAddress = source.readAddress();
    const _stakerToncastAmount = source.readBigNumber();
    return { $$type: 'PayoutStaker' as const, queryId: _queryId, stakerAddress: _stakerAddress, stakerToncastAmount: _stakerToncastAmount };
}

export function loadGetterTuplePayoutStaker(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _stakerAddress = source.readAddress();
    const _stakerToncastAmount = source.readBigNumber();
    return { $$type: 'PayoutStaker' as const, queryId: _queryId, stakerAddress: _stakerAddress, stakerToncastAmount: _stakerToncastAmount };
}

export function storeTuplePayoutStaker(source: PayoutStaker) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.stakerAddress);
    builder.writeNumber(source.stakerToncastAmount);
    return builder.build();
}

export function dictValueParserPayoutStaker(): DictionaryValue<PayoutStaker> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storePayoutStaker(src)).endCell());
        },
        parse: (src) => {
            return loadPayoutStaker(src.loadRef().beginParse());
        }
    }
}

export type ProcessEpochPayouts = {
    $$type: 'ProcessEpochPayouts';
    userAddress: Address;
    withdrawnAmount: bigint;
    startEpoch: bigint;
    endEpoch: bigint;
}

export function storeProcessEpochPayouts(src: ProcessEpochPayouts) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2370530975, 32);
        b_0.storeAddress(src.userAddress);
        b_0.storeCoins(src.withdrawnAmount);
        b_0.storeUint(src.startEpoch, 32);
        b_0.storeUint(src.endEpoch, 32);
    };
}

export function loadProcessEpochPayouts(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2370530975) { throw Error('Invalid prefix'); }
    const _userAddress = sc_0.loadAddress();
    const _withdrawnAmount = sc_0.loadCoins();
    const _startEpoch = sc_0.loadUintBig(32);
    const _endEpoch = sc_0.loadUintBig(32);
    return { $$type: 'ProcessEpochPayouts' as const, userAddress: _userAddress, withdrawnAmount: _withdrawnAmount, startEpoch: _startEpoch, endEpoch: _endEpoch };
}

export function loadTupleProcessEpochPayouts(source: TupleReader) {
    const _userAddress = source.readAddress();
    const _withdrawnAmount = source.readBigNumber();
    const _startEpoch = source.readBigNumber();
    const _endEpoch = source.readBigNumber();
    return { $$type: 'ProcessEpochPayouts' as const, userAddress: _userAddress, withdrawnAmount: _withdrawnAmount, startEpoch: _startEpoch, endEpoch: _endEpoch };
}

export function loadGetterTupleProcessEpochPayouts(source: TupleReader) {
    const _userAddress = source.readAddress();
    const _withdrawnAmount = source.readBigNumber();
    const _startEpoch = source.readBigNumber();
    const _endEpoch = source.readBigNumber();
    return { $$type: 'ProcessEpochPayouts' as const, userAddress: _userAddress, withdrawnAmount: _withdrawnAmount, startEpoch: _startEpoch, endEpoch: _endEpoch };
}

export function storeTupleProcessEpochPayouts(source: ProcessEpochPayouts) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.userAddress);
    builder.writeNumber(source.withdrawnAmount);
    builder.writeNumber(source.startEpoch);
    builder.writeNumber(source.endEpoch);
    return builder.build();
}

export function dictValueParserProcessEpochPayouts(): DictionaryValue<ProcessEpochPayouts> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeProcessEpochPayouts(src)).endCell());
        },
        parse: (src) => {
            return loadProcessEpochPayouts(src.loadRef().beginParse());
        }
    }
}

export type EpochData = {
    $$type: 'EpochData';
    epochNumber: bigint;
    totalTonReceived: bigint;
    totalToncastStaked: bigint;
    isInitialized: boolean;
    owner: Address;
}

export function storeEpochData(src: EpochData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(src.epochNumber, 32);
        b_0.storeCoins(src.totalTonReceived);
        b_0.storeCoins(src.totalToncastStaked);
        b_0.storeBit(src.isInitialized);
        b_0.storeAddress(src.owner);
    };
}

export function loadEpochData(slice: Slice) {
    const sc_0 = slice;
    const _epochNumber = sc_0.loadUintBig(32);
    const _totalTonReceived = sc_0.loadCoins();
    const _totalToncastStaked = sc_0.loadCoins();
    const _isInitialized = sc_0.loadBit();
    const _owner = sc_0.loadAddress();
    return { $$type: 'EpochData' as const, epochNumber: _epochNumber, totalTonReceived: _totalTonReceived, totalToncastStaked: _totalToncastStaked, isInitialized: _isInitialized, owner: _owner };
}

export function loadTupleEpochData(source: TupleReader) {
    const _epochNumber = source.readBigNumber();
    const _totalTonReceived = source.readBigNumber();
    const _totalToncastStaked = source.readBigNumber();
    const _isInitialized = source.readBoolean();
    const _owner = source.readAddress();
    return { $$type: 'EpochData' as const, epochNumber: _epochNumber, totalTonReceived: _totalTonReceived, totalToncastStaked: _totalToncastStaked, isInitialized: _isInitialized, owner: _owner };
}

export function loadGetterTupleEpochData(source: TupleReader) {
    const _epochNumber = source.readBigNumber();
    const _totalTonReceived = source.readBigNumber();
    const _totalToncastStaked = source.readBigNumber();
    const _isInitialized = source.readBoolean();
    const _owner = source.readAddress();
    return { $$type: 'EpochData' as const, epochNumber: _epochNumber, totalTonReceived: _totalTonReceived, totalToncastStaked: _totalToncastStaked, isInitialized: _isInitialized, owner: _owner };
}

export function storeTupleEpochData(source: EpochData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.epochNumber);
    builder.writeNumber(source.totalTonReceived);
    builder.writeNumber(source.totalToncastStaked);
    builder.writeBoolean(source.isInitialized);
    builder.writeAddress(source.owner);
    return builder.build();
}

export function dictValueParserEpochData(): DictionaryValue<EpochData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeEpochData(src)).endCell());
        },
        parse: (src) => {
            return loadEpochData(src.loadRef().beginParse());
        }
    }
}

export type JettonTransferNotification = {
    $$type: 'JettonTransferNotification';
    queryId: bigint;
    amount: bigint;
    sender: Address;
    forwardPayload: Slice;
}

export function storeJettonTransferNotification(src: JettonTransferNotification) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1935855772, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeCoins(src.amount);
        b_0.storeAddress(src.sender);
        b_0.storeBuilder(src.forwardPayload.asBuilder());
    };
}

export function loadJettonTransferNotification(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1935855772) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _amount = sc_0.loadCoins();
    const _sender = sc_0.loadAddress();
    const _forwardPayload = sc_0;
    return { $$type: 'JettonTransferNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, forwardPayload: _forwardPayload };
}

export function loadTupleJettonTransferNotification(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _sender = source.readAddress();
    const _forwardPayload = source.readCell().asSlice();
    return { $$type: 'JettonTransferNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, forwardPayload: _forwardPayload };
}

export function loadGetterTupleJettonTransferNotification(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _amount = source.readBigNumber();
    const _sender = source.readAddress();
    const _forwardPayload = source.readCell().asSlice();
    return { $$type: 'JettonTransferNotification' as const, queryId: _queryId, amount: _amount, sender: _sender, forwardPayload: _forwardPayload };
}

export function storeTupleJettonTransferNotification(source: JettonTransferNotification) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.amount);
    builder.writeAddress(source.sender);
    builder.writeSlice(source.forwardPayload.asCell());
    return builder.build();
}

export function dictValueParserJettonTransferNotification(): DictionaryValue<JettonTransferNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonTransferNotification(src)).endCell());
        },
        parse: (src) => {
            return loadJettonTransferNotification(src.loadRef().beginParse());
        }
    }
}

export type NftTransferNotification = {
    $$type: 'NftTransferNotification';
    queryId: bigint;
    prevOwner: Address;
    forwardPayload: Slice;
}

export function storeNftTransferNotification(src: NftTransferNotification) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(85167505, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeAddress(src.prevOwner);
        b_0.storeBuilder(src.forwardPayload.asBuilder());
    };
}

export function loadNftTransferNotification(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 85167505) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _prevOwner = sc_0.loadAddress();
    const _forwardPayload = sc_0;
    return { $$type: 'NftTransferNotification' as const, queryId: _queryId, prevOwner: _prevOwner, forwardPayload: _forwardPayload };
}

export function loadTupleNftTransferNotification(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _prevOwner = source.readAddress();
    const _forwardPayload = source.readCell().asSlice();
    return { $$type: 'NftTransferNotification' as const, queryId: _queryId, prevOwner: _prevOwner, forwardPayload: _forwardPayload };
}

export function loadGetterTupleNftTransferNotification(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _prevOwner = source.readAddress();
    const _forwardPayload = source.readCell().asSlice();
    return { $$type: 'NftTransferNotification' as const, queryId: _queryId, prevOwner: _prevOwner, forwardPayload: _forwardPayload };
}

export function storeTupleNftTransferNotification(source: NftTransferNotification) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeAddress(source.prevOwner);
    builder.writeSlice(source.forwardPayload.asCell());
    return builder.build();
}

export function dictValueParserNftTransferNotification(): DictionaryValue<NftTransferNotification> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeNftTransferNotification(src)).endCell());
        },
        parse: (src) => {
            return loadNftTransferNotification(src.loadRef().beginParse());
        }
    }
}

export type NftGetAllData = {
    $$type: 'NftGetAllData';
    queryId: bigint;
}

export function storeNftGetAllData(src: NftGetAllData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(976894522, 32);
        b_0.storeUint(src.queryId, 64);
    };
}

export function loadNftGetAllData(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 976894522) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    return { $$type: 'NftGetAllData' as const, queryId: _queryId };
}

export function loadTupleNftGetAllData(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'NftGetAllData' as const, queryId: _queryId };
}

export function loadGetterTupleNftGetAllData(source: TupleReader) {
    const _queryId = source.readBigNumber();
    return { $$type: 'NftGetAllData' as const, queryId: _queryId };
}

export function storeTupleNftGetAllData(source: NftGetAllData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    return builder.build();
}

export function dictValueParserNftGetAllData(): DictionaryValue<NftGetAllData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeNftGetAllData(src)).endCell());
        },
        parse: (src) => {
            return loadNftGetAllData(src.loadRef().beginParse());
        }
    }
}

export type NftReportAllData = {
    $$type: 'NftReportAllData';
    queryId: bigint;
    index: bigint;
    data: Cell;
}

export function storeNftReportAllData(src: NftReportAllData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(2071690107, 32);
        b_0.storeUint(src.queryId, 64);
        b_0.storeUint(src.index, 64);
        b_0.storeRef(src.data);
    };
}

export function loadNftReportAllData(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 2071690107) { throw Error('Invalid prefix'); }
    const _queryId = sc_0.loadUintBig(64);
    const _index = sc_0.loadUintBig(64);
    const _data = sc_0.loadRef();
    return { $$type: 'NftReportAllData' as const, queryId: _queryId, index: _index, data: _data };
}

export function loadTupleNftReportAllData(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _index = source.readBigNumber();
    const _data = source.readCell();
    return { $$type: 'NftReportAllData' as const, queryId: _queryId, index: _index, data: _data };
}

export function loadGetterTupleNftReportAllData(source: TupleReader) {
    const _queryId = source.readBigNumber();
    const _index = source.readBigNumber();
    const _data = source.readCell();
    return { $$type: 'NftReportAllData' as const, queryId: _queryId, index: _index, data: _data };
}

export function storeTupleNftReportAllData(source: NftReportAllData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.queryId);
    builder.writeNumber(source.index);
    builder.writeCell(source.data);
    return builder.build();
}

export function dictValueParserNftReportAllData(): DictionaryValue<NftReportAllData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeNftReportAllData(src)).endCell());
        },
        parse: (src) => {
            return loadNftReportAllData(src.loadRef().beginParse());
        }
    }
}

export type StopAndRedirect = {
    $$type: 'StopAndRedirect';
    newDaoAddress: Address;
}

export function storeStopAndRedirect(src: StopAndRedirect) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(1398034256, 32);
        b_0.storeAddress(src.newDaoAddress);
    };
}

export function loadStopAndRedirect(slice: Slice) {
    const sc_0 = slice;
    if (sc_0.loadUint(32) !== 1398034256) { throw Error('Invalid prefix'); }
    const _newDaoAddress = sc_0.loadAddress();
    return { $$type: 'StopAndRedirect' as const, newDaoAddress: _newDaoAddress };
}

export function loadTupleStopAndRedirect(source: TupleReader) {
    const _newDaoAddress = source.readAddress();
    return { $$type: 'StopAndRedirect' as const, newDaoAddress: _newDaoAddress };
}

export function loadGetterTupleStopAndRedirect(source: TupleReader) {
    const _newDaoAddress = source.readAddress();
    return { $$type: 'StopAndRedirect' as const, newDaoAddress: _newDaoAddress };
}

export function storeTupleStopAndRedirect(source: StopAndRedirect) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.newDaoAddress);
    return builder.build();
}

export function dictValueParserStopAndRedirect(): DictionaryValue<StopAndRedirect> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStopAndRedirect(src)).endCell());
        },
        parse: (src) => {
            return loadStopAndRedirect(src.loadRef().beginParse());
        }
    }
}

export type JettonWalletData = {
    $$type: 'JettonWalletData';
    balance: bigint;
    ownerAddress: Address;
    jettonMasterAddress: Address;
    jettonWalletCode: Cell;
}

export function storeJettonWalletData(src: JettonWalletData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeCoins(src.balance);
        b_0.storeAddress(src.ownerAddress);
        b_0.storeAddress(src.jettonMasterAddress);
        b_0.storeRef(src.jettonWalletCode);
    };
}

export function loadJettonWalletData(slice: Slice) {
    const sc_0 = slice;
    const _balance = sc_0.loadCoins();
    const _ownerAddress = sc_0.loadAddress();
    const _jettonMasterAddress = sc_0.loadAddress();
    const _jettonWalletCode = sc_0.loadRef();
    return { $$type: 'JettonWalletData' as const, balance: _balance, ownerAddress: _ownerAddress, jettonMasterAddress: _jettonMasterAddress, jettonWalletCode: _jettonWalletCode };
}

export function loadTupleJettonWalletData(source: TupleReader) {
    const _balance = source.readBigNumber();
    const _ownerAddress = source.readAddress();
    const _jettonMasterAddress = source.readAddress();
    const _jettonWalletCode = source.readCell();
    return { $$type: 'JettonWalletData' as const, balance: _balance, ownerAddress: _ownerAddress, jettonMasterAddress: _jettonMasterAddress, jettonWalletCode: _jettonWalletCode };
}

export function loadGetterTupleJettonWalletData(source: TupleReader) {
    const _balance = source.readBigNumber();
    const _ownerAddress = source.readAddress();
    const _jettonMasterAddress = source.readAddress();
    const _jettonWalletCode = source.readCell();
    return { $$type: 'JettonWalletData' as const, balance: _balance, ownerAddress: _ownerAddress, jettonMasterAddress: _jettonMasterAddress, jettonWalletCode: _jettonWalletCode };
}

export function storeTupleJettonWalletData(source: JettonWalletData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.balance);
    builder.writeAddress(source.ownerAddress);
    builder.writeAddress(source.jettonMasterAddress);
    builder.writeCell(source.jettonWalletCode);
    return builder.build();
}

export function dictValueParserJettonWalletData(): DictionaryValue<JettonWalletData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeJettonWalletData(src)).endCell());
        },
        parse: (src) => {
            return loadJettonWalletData(src.loadRef().beginParse());
        }
    }
}

export type StakingData = {
    $$type: 'StakingData';
    amount: bigint;
    timestamp: bigint;
    daoAddress: Address;
}

export function storeStakingData(src: StakingData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeCoins(src.amount);
        b_0.storeUint(src.timestamp, 64);
        b_0.storeAddress(src.daoAddress);
    };
}

export function loadStakingData(slice: Slice) {
    const sc_0 = slice;
    const _amount = sc_0.loadCoins();
    const _timestamp = sc_0.loadUintBig(64);
    const _daoAddress = sc_0.loadAddress();
    return { $$type: 'StakingData' as const, amount: _amount, timestamp: _timestamp, daoAddress: _daoAddress };
}

export function loadTupleStakingData(source: TupleReader) {
    const _amount = source.readBigNumber();
    const _timestamp = source.readBigNumber();
    const _daoAddress = source.readAddress();
    return { $$type: 'StakingData' as const, amount: _amount, timestamp: _timestamp, daoAddress: _daoAddress };
}

export function loadGetterTupleStakingData(source: TupleReader) {
    const _amount = source.readBigNumber();
    const _timestamp = source.readBigNumber();
    const _daoAddress = source.readAddress();
    return { $$type: 'StakingData' as const, amount: _amount, timestamp: _timestamp, daoAddress: _daoAddress };
}

export function storeTupleStakingData(source: StakingData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.amount);
    builder.writeNumber(source.timestamp);
    builder.writeAddress(source.daoAddress);
    return builder.build();
}

export function dictValueParserStakingData(): DictionaryValue<StakingData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeStakingData(src)).endCell());
        },
        parse: (src) => {
            return loadStakingData(src.loadRef().beginParse());
        }
    }
}

export type DAOEpochData = {
    $$type: 'DAOEpochData';
    deployTime: bigint;
    currentRealTimeEpoch: bigint;
    epochDuration: bigint;
    currentStoredEpochNumber: bigint;
    totalCurrentlyStaked: bigint;
}

export function storeDAOEpochData(src: DAOEpochData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(src.deployTime, 64);
        b_0.storeUint(src.currentRealTimeEpoch, 32);
        b_0.storeUint(src.epochDuration, 32);
        b_0.storeUint(src.currentStoredEpochNumber, 32);
        b_0.storeCoins(src.totalCurrentlyStaked);
    };
}

export function loadDAOEpochData(slice: Slice) {
    const sc_0 = slice;
    const _deployTime = sc_0.loadUintBig(64);
    const _currentRealTimeEpoch = sc_0.loadUintBig(32);
    const _epochDuration = sc_0.loadUintBig(32);
    const _currentStoredEpochNumber = sc_0.loadUintBig(32);
    const _totalCurrentlyStaked = sc_0.loadCoins();
    return { $$type: 'DAOEpochData' as const, deployTime: _deployTime, currentRealTimeEpoch: _currentRealTimeEpoch, epochDuration: _epochDuration, currentStoredEpochNumber: _currentStoredEpochNumber, totalCurrentlyStaked: _totalCurrentlyStaked };
}

export function loadTupleDAOEpochData(source: TupleReader) {
    const _deployTime = source.readBigNumber();
    const _currentRealTimeEpoch = source.readBigNumber();
    const _epochDuration = source.readBigNumber();
    const _currentStoredEpochNumber = source.readBigNumber();
    const _totalCurrentlyStaked = source.readBigNumber();
    return { $$type: 'DAOEpochData' as const, deployTime: _deployTime, currentRealTimeEpoch: _currentRealTimeEpoch, epochDuration: _epochDuration, currentStoredEpochNumber: _currentStoredEpochNumber, totalCurrentlyStaked: _totalCurrentlyStaked };
}

export function loadGetterTupleDAOEpochData(source: TupleReader) {
    const _deployTime = source.readBigNumber();
    const _currentRealTimeEpoch = source.readBigNumber();
    const _epochDuration = source.readBigNumber();
    const _currentStoredEpochNumber = source.readBigNumber();
    const _totalCurrentlyStaked = source.readBigNumber();
    return { $$type: 'DAOEpochData' as const, deployTime: _deployTime, currentRealTimeEpoch: _currentRealTimeEpoch, epochDuration: _epochDuration, currentStoredEpochNumber: _currentStoredEpochNumber, totalCurrentlyStaked: _totalCurrentlyStaked };
}

export function storeTupleDAOEpochData(source: DAOEpochData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.deployTime);
    builder.writeNumber(source.currentRealTimeEpoch);
    builder.writeNumber(source.epochDuration);
    builder.writeNumber(source.currentStoredEpochNumber);
    builder.writeNumber(source.totalCurrentlyStaked);
    return builder.build();
}

export function dictValueParserDAOEpochData(): DictionaryValue<DAOEpochData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDAOEpochData(src)).endCell());
        },
        parse: (src) => {
            return loadDAOEpochData(src.loadRef().beginParse());
        }
    }
}

export type DAOConfigData = {
    $$type: 'DAOConfigData';
    nextItemIndex: bigint;
    nftCollectionAddress: Address | null;
    jettonMasterAddress: Address;
    jettonWalletAddress: Address;
    minDepositAmount: bigint;
    nftNamePrefix: string;
    nftImageUrl: string;
    isReadyToAcceptDeposits: boolean;
    stopped: boolean;
    newDaoAddress: Address | null;
}

export function storeDAOConfigData(src: DAOConfigData) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeUint(src.nextItemIndex, 64);
        b_0.storeAddress(src.nftCollectionAddress);
        b_0.storeAddress(src.jettonMasterAddress);
        b_0.storeAddress(src.jettonWalletAddress);
        b_0.storeCoins(src.minDepositAmount);
        b_0.storeStringRefTail(src.nftNamePrefix);
        b_0.storeStringRefTail(src.nftImageUrl);
        b_0.storeBit(src.isReadyToAcceptDeposits);
        b_0.storeBit(src.stopped);
        const b_1 = new Builder();
        b_1.storeAddress(src.newDaoAddress);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadDAOConfigData(slice: Slice) {
    const sc_0 = slice;
    const _nextItemIndex = sc_0.loadUintBig(64);
    const _nftCollectionAddress = sc_0.loadMaybeAddress();
    const _jettonMasterAddress = sc_0.loadAddress();
    const _jettonWalletAddress = sc_0.loadAddress();
    const _minDepositAmount = sc_0.loadCoins();
    const _nftNamePrefix = sc_0.loadStringRefTail();
    const _nftImageUrl = sc_0.loadStringRefTail();
    const _isReadyToAcceptDeposits = sc_0.loadBit();
    const _stopped = sc_0.loadBit();
    const sc_1 = sc_0.loadRef().beginParse();
    const _newDaoAddress = sc_1.loadMaybeAddress();
    return { $$type: 'DAOConfigData' as const, nextItemIndex: _nextItemIndex, nftCollectionAddress: _nftCollectionAddress, jettonMasterAddress: _jettonMasterAddress, jettonWalletAddress: _jettonWalletAddress, minDepositAmount: _minDepositAmount, nftNamePrefix: _nftNamePrefix, nftImageUrl: _nftImageUrl, isReadyToAcceptDeposits: _isReadyToAcceptDeposits, stopped: _stopped, newDaoAddress: _newDaoAddress };
}

export function loadTupleDAOConfigData(source: TupleReader) {
    const _nextItemIndex = source.readBigNumber();
    const _nftCollectionAddress = source.readAddressOpt();
    const _jettonMasterAddress = source.readAddress();
    const _jettonWalletAddress = source.readAddress();
    const _minDepositAmount = source.readBigNumber();
    const _nftNamePrefix = source.readString();
    const _nftImageUrl = source.readString();
    const _isReadyToAcceptDeposits = source.readBoolean();
    const _stopped = source.readBoolean();
    const _newDaoAddress = source.readAddressOpt();
    return { $$type: 'DAOConfigData' as const, nextItemIndex: _nextItemIndex, nftCollectionAddress: _nftCollectionAddress, jettonMasterAddress: _jettonMasterAddress, jettonWalletAddress: _jettonWalletAddress, minDepositAmount: _minDepositAmount, nftNamePrefix: _nftNamePrefix, nftImageUrl: _nftImageUrl, isReadyToAcceptDeposits: _isReadyToAcceptDeposits, stopped: _stopped, newDaoAddress: _newDaoAddress };
}

export function loadGetterTupleDAOConfigData(source: TupleReader) {
    const _nextItemIndex = source.readBigNumber();
    const _nftCollectionAddress = source.readAddressOpt();
    const _jettonMasterAddress = source.readAddress();
    const _jettonWalletAddress = source.readAddress();
    const _minDepositAmount = source.readBigNumber();
    const _nftNamePrefix = source.readString();
    const _nftImageUrl = source.readString();
    const _isReadyToAcceptDeposits = source.readBoolean();
    const _stopped = source.readBoolean();
    const _newDaoAddress = source.readAddressOpt();
    return { $$type: 'DAOConfigData' as const, nextItemIndex: _nextItemIndex, nftCollectionAddress: _nftCollectionAddress, jettonMasterAddress: _jettonMasterAddress, jettonWalletAddress: _jettonWalletAddress, minDepositAmount: _minDepositAmount, nftNamePrefix: _nftNamePrefix, nftImageUrl: _nftImageUrl, isReadyToAcceptDeposits: _isReadyToAcceptDeposits, stopped: _stopped, newDaoAddress: _newDaoAddress };
}

export function storeTupleDAOConfigData(source: DAOConfigData) {
    const builder = new TupleBuilder();
    builder.writeNumber(source.nextItemIndex);
    builder.writeAddress(source.nftCollectionAddress);
    builder.writeAddress(source.jettonMasterAddress);
    builder.writeAddress(source.jettonWalletAddress);
    builder.writeNumber(source.minDepositAmount);
    builder.writeString(source.nftNamePrefix);
    builder.writeString(source.nftImageUrl);
    builder.writeBoolean(source.isReadyToAcceptDeposits);
    builder.writeBoolean(source.stopped);
    builder.writeAddress(source.newDaoAddress);
    return builder.build();
}

export function dictValueParserDAOConfigData(): DictionaryValue<DAOConfigData> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeDAOConfigData(src)).endCell());
        },
        parse: (src) => {
            return loadDAOConfigData(src.loadRef().beginParse());
        }
    }
}

export type ToncastDAOepoch$Data = {
    $$type: 'ToncastDAOepoch$Data';
    owner: Address;
    epochNumber: bigint;
    totalTonReceived: bigint;
    totalToncastStaked: bigint;
    isInitialized: boolean;
}

export function storeToncastDAOepoch$Data(src: ToncastDAOepoch$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeUint(src.epochNumber, 32);
        b_0.storeCoins(src.totalTonReceived);
        b_0.storeCoins(src.totalToncastStaked);
        b_0.storeBit(src.isInitialized);
    };
}

export function loadToncastDAOepoch$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _epochNumber = sc_0.loadUintBig(32);
    const _totalTonReceived = sc_0.loadCoins();
    const _totalToncastStaked = sc_0.loadCoins();
    const _isInitialized = sc_0.loadBit();
    return { $$type: 'ToncastDAOepoch$Data' as const, owner: _owner, epochNumber: _epochNumber, totalTonReceived: _totalTonReceived, totalToncastStaked: _totalToncastStaked, isInitialized: _isInitialized };
}

export function loadTupleToncastDAOepoch$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _epochNumber = source.readBigNumber();
    const _totalTonReceived = source.readBigNumber();
    const _totalToncastStaked = source.readBigNumber();
    const _isInitialized = source.readBoolean();
    return { $$type: 'ToncastDAOepoch$Data' as const, owner: _owner, epochNumber: _epochNumber, totalTonReceived: _totalTonReceived, totalToncastStaked: _totalToncastStaked, isInitialized: _isInitialized };
}

export function loadGetterTupleToncastDAOepoch$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _epochNumber = source.readBigNumber();
    const _totalTonReceived = source.readBigNumber();
    const _totalToncastStaked = source.readBigNumber();
    const _isInitialized = source.readBoolean();
    return { $$type: 'ToncastDAOepoch$Data' as const, owner: _owner, epochNumber: _epochNumber, totalTonReceived: _totalTonReceived, totalToncastStaked: _totalToncastStaked, isInitialized: _isInitialized };
}

export function storeTupleToncastDAOepoch$Data(source: ToncastDAOepoch$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeNumber(source.epochNumber);
    builder.writeNumber(source.totalTonReceived);
    builder.writeNumber(source.totalToncastStaked);
    builder.writeBoolean(source.isInitialized);
    return builder.build();
}

export function dictValueParserToncastDAOepoch$Data(): DictionaryValue<ToncastDAOepoch$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeToncastDAOepoch$Data(src)).endCell());
        },
        parse: (src) => {
            return loadToncastDAOepoch$Data(src.loadRef().beginParse());
        }
    }
}

export type ToncastDAO$Data = {
    $$type: 'ToncastDAO$Data';
    owner: Address;
    stopped: boolean;
    nftCollectionAddress: Address | null;
    jettonMasterAddress: Address;
    minDepositAmount: bigint;
    nextItemIndex: bigint;
    nftNamePrefix: string;
    nftImageUrl: string;
    pendingWithdrawals: Dictionary<Address, bigint>;
    pendingWithdrawalOwners: Dictionary<Address, Address>;
    collectionMetadata: Cell;
    seq: bigint;
    newDaoAddress: Address | null;
    deployTime: bigint;
    epochDuration: bigint;
    lastProcessedEpoch: bigint;
    totalCurrentlyStaked: bigint;
}

export function storeToncastDAO$Data(src: ToncastDAO$Data) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeBit(src.stopped);
        b_0.storeAddress(src.nftCollectionAddress);
        b_0.storeAddress(src.jettonMasterAddress);
        b_0.storeCoins(src.minDepositAmount);
        b_0.storeUint(src.nextItemIndex, 64);
        b_0.storeStringRefTail(src.nftNamePrefix);
        b_0.storeStringRefTail(src.nftImageUrl);
        const b_1 = new Builder();
        b_1.storeDict(src.pendingWithdrawals, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257));
        b_1.storeDict(src.pendingWithdrawalOwners, Dictionary.Keys.Address(), Dictionary.Values.Address());
        b_1.storeRef(src.collectionMetadata);
        b_1.storeUint(src.seq, 32);
        b_1.storeAddress(src.newDaoAddress);
        b_1.storeUint(src.deployTime, 64);
        b_1.storeUint(src.epochDuration, 32);
        b_1.storeUint(src.lastProcessedEpoch, 32);
        b_1.storeCoins(src.totalCurrentlyStaked);
        b_0.storeRef(b_1.endCell());
    };
}

export function loadToncastDAO$Data(slice: Slice) {
    const sc_0 = slice;
    const _owner = sc_0.loadAddress();
    const _stopped = sc_0.loadBit();
    const _nftCollectionAddress = sc_0.loadMaybeAddress();
    const _jettonMasterAddress = sc_0.loadAddress();
    const _minDepositAmount = sc_0.loadCoins();
    const _nextItemIndex = sc_0.loadUintBig(64);
    const _nftNamePrefix = sc_0.loadStringRefTail();
    const _nftImageUrl = sc_0.loadStringRefTail();
    const sc_1 = sc_0.loadRef().beginParse();
    const _pendingWithdrawals = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), sc_1);
    const _pendingWithdrawalOwners = Dictionary.load(Dictionary.Keys.Address(), Dictionary.Values.Address(), sc_1);
    const _collectionMetadata = sc_1.loadRef();
    const _seq = sc_1.loadUintBig(32);
    const _newDaoAddress = sc_1.loadMaybeAddress();
    const _deployTime = sc_1.loadUintBig(64);
    const _epochDuration = sc_1.loadUintBig(32);
    const _lastProcessedEpoch = sc_1.loadUintBig(32);
    const _totalCurrentlyStaked = sc_1.loadCoins();
    return { $$type: 'ToncastDAO$Data' as const, owner: _owner, stopped: _stopped, nftCollectionAddress: _nftCollectionAddress, jettonMasterAddress: _jettonMasterAddress, minDepositAmount: _minDepositAmount, nextItemIndex: _nextItemIndex, nftNamePrefix: _nftNamePrefix, nftImageUrl: _nftImageUrl, pendingWithdrawals: _pendingWithdrawals, pendingWithdrawalOwners: _pendingWithdrawalOwners, collectionMetadata: _collectionMetadata, seq: _seq, newDaoAddress: _newDaoAddress, deployTime: _deployTime, epochDuration: _epochDuration, lastProcessedEpoch: _lastProcessedEpoch, totalCurrentlyStaked: _totalCurrentlyStaked };
}

export function loadTupleToncastDAO$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _stopped = source.readBoolean();
    const _nftCollectionAddress = source.readAddressOpt();
    const _jettonMasterAddress = source.readAddress();
    const _minDepositAmount = source.readBigNumber();
    const _nextItemIndex = source.readBigNumber();
    const _nftNamePrefix = source.readString();
    const _nftImageUrl = source.readString();
    const _pendingWithdrawals = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _pendingWithdrawalOwners = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Address(), source.readCellOpt());
    const _collectionMetadata = source.readCell();
    const _seq = source.readBigNumber();
    const _newDaoAddress = source.readAddressOpt();
    const _deployTime = source.readBigNumber();
    source = source.readTuple();
    const _epochDuration = source.readBigNumber();
    const _lastProcessedEpoch = source.readBigNumber();
    const _totalCurrentlyStaked = source.readBigNumber();
    return { $$type: 'ToncastDAO$Data' as const, owner: _owner, stopped: _stopped, nftCollectionAddress: _nftCollectionAddress, jettonMasterAddress: _jettonMasterAddress, minDepositAmount: _minDepositAmount, nextItemIndex: _nextItemIndex, nftNamePrefix: _nftNamePrefix, nftImageUrl: _nftImageUrl, pendingWithdrawals: _pendingWithdrawals, pendingWithdrawalOwners: _pendingWithdrawalOwners, collectionMetadata: _collectionMetadata, seq: _seq, newDaoAddress: _newDaoAddress, deployTime: _deployTime, epochDuration: _epochDuration, lastProcessedEpoch: _lastProcessedEpoch, totalCurrentlyStaked: _totalCurrentlyStaked };
}

export function loadGetterTupleToncastDAO$Data(source: TupleReader) {
    const _owner = source.readAddress();
    const _stopped = source.readBoolean();
    const _nftCollectionAddress = source.readAddressOpt();
    const _jettonMasterAddress = source.readAddress();
    const _minDepositAmount = source.readBigNumber();
    const _nextItemIndex = source.readBigNumber();
    const _nftNamePrefix = source.readString();
    const _nftImageUrl = source.readString();
    const _pendingWithdrawals = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.BigInt(257), source.readCellOpt());
    const _pendingWithdrawalOwners = Dictionary.loadDirect(Dictionary.Keys.Address(), Dictionary.Values.Address(), source.readCellOpt());
    const _collectionMetadata = source.readCell();
    const _seq = source.readBigNumber();
    const _newDaoAddress = source.readAddressOpt();
    const _deployTime = source.readBigNumber();
    const _epochDuration = source.readBigNumber();
    const _lastProcessedEpoch = source.readBigNumber();
    const _totalCurrentlyStaked = source.readBigNumber();
    return { $$type: 'ToncastDAO$Data' as const, owner: _owner, stopped: _stopped, nftCollectionAddress: _nftCollectionAddress, jettonMasterAddress: _jettonMasterAddress, minDepositAmount: _minDepositAmount, nextItemIndex: _nextItemIndex, nftNamePrefix: _nftNamePrefix, nftImageUrl: _nftImageUrl, pendingWithdrawals: _pendingWithdrawals, pendingWithdrawalOwners: _pendingWithdrawalOwners, collectionMetadata: _collectionMetadata, seq: _seq, newDaoAddress: _newDaoAddress, deployTime: _deployTime, epochDuration: _epochDuration, lastProcessedEpoch: _lastProcessedEpoch, totalCurrentlyStaked: _totalCurrentlyStaked };
}

export function storeTupleToncastDAO$Data(source: ToncastDAO$Data) {
    const builder = new TupleBuilder();
    builder.writeAddress(source.owner);
    builder.writeBoolean(source.stopped);
    builder.writeAddress(source.nftCollectionAddress);
    builder.writeAddress(source.jettonMasterAddress);
    builder.writeNumber(source.minDepositAmount);
    builder.writeNumber(source.nextItemIndex);
    builder.writeString(source.nftNamePrefix);
    builder.writeString(source.nftImageUrl);
    builder.writeCell(source.pendingWithdrawals.size > 0 ? beginCell().storeDictDirect(source.pendingWithdrawals, Dictionary.Keys.Address(), Dictionary.Values.BigInt(257)).endCell() : null);
    builder.writeCell(source.pendingWithdrawalOwners.size > 0 ? beginCell().storeDictDirect(source.pendingWithdrawalOwners, Dictionary.Keys.Address(), Dictionary.Values.Address()).endCell() : null);
    builder.writeCell(source.collectionMetadata);
    builder.writeNumber(source.seq);
    builder.writeAddress(source.newDaoAddress);
    builder.writeNumber(source.deployTime);
    builder.writeNumber(source.epochDuration);
    builder.writeNumber(source.lastProcessedEpoch);
    builder.writeNumber(source.totalCurrentlyStaked);
    return builder.build();
}

export function dictValueParserToncastDAO$Data(): DictionaryValue<ToncastDAO$Data> {
    return {
        serialize: (src, builder) => {
            builder.storeRef(beginCell().store(storeToncastDAO$Data(src)).endCell());
        },
        parse: (src) => {
            return loadToncastDAO$Data(src.loadRef().beginParse());
        }
    }
}

 type ToncastDAO_init_args = {
    $$type: 'ToncastDAO_init_args';
    owner: Address;
    jettonMasterAddress: Address;
    minDepositAmount: bigint;
    nextItemIndex: bigint;
    nftNamePrefix: string;
    nftImageUrl: string;
    epochDuration: bigint;
    collectionMetadata: Cell;
    seq: bigint;
}

function initToncastDAO_init_args(src: ToncastDAO_init_args) {
    return (builder: Builder) => {
        const b_0 = builder;
        b_0.storeAddress(src.owner);
        b_0.storeAddress(src.jettonMasterAddress);
        b_0.storeCoins(src.minDepositAmount);
        b_0.storeUint(src.nextItemIndex, 64);
        b_0.storeStringRefTail(src.nftNamePrefix);
        const b_1 = new Builder();
        b_1.storeStringRefTail(src.nftImageUrl);
        b_1.storeUint(src.epochDuration, 32);
        b_1.storeRef(src.collectionMetadata);
        b_1.storeUint(src.seq, 32);
        b_0.storeRef(b_1.endCell());
    };
}

async function ToncastDAO_init(owner: Address, jettonMasterAddress: Address, minDepositAmount: bigint, nextItemIndex: bigint, nftNamePrefix: string, nftImageUrl: string, epochDuration: bigint, collectionMetadata: Cell, seq: bigint) {
    const __code = Cell.fromHex('b5ee9c7241027a01001b29000228ff008e88f4a413f4bcf2c80bed5320e303ed43d9010f020271020a0201580308020148040602abae8ef6a268690000c7217d207d207d00699fea00e800ea00e86a00e800e98fea698f980824882408238823082284e8aa83b836b6b6fc11b81008373687083e86083d85083c8834082b882b2cf186ed9e2b882f8798c010050004561002abad15f6a268690000c7217d207d207d00699fea00e800ea00e86a00e800e98fea698f980824882408238823082284e8aa83b836b6b6fc11b81008373687083e86083d85083c8834082b882b2cf186ed9e2b882f8798c0100700022602a9b51e7da89a1a400031c85f481f481f401a67fa803a003a803a1a803a003a63fa9a63e6020922090208e208c208a13a2aa0ee0dadadbf046e04020dcda1c20fa1820f61420f220d020ae20acb3c61bb678d9ead84b0100900ec231110111111100f11110f0e11110e0d11110d0c11110c0b11110b0a11110a0911110911110807065540f82324b9917097f82324a123a904e2011112015d56141114111511141113111411131112111311121111111211111110111111100f11100f10ef10de10cd10bc10ab109a10891078106710560201200b0d02a9b9890ed44d0d200018e42fa40fa40fa00d33fd401d001d401d0d401d001d31fd4d31f301049104810471046104509d15507706d6d6df8237020106e6d0e107d0c107b0a107910681057105659e30ddb3c6caa6c7a8100c0138f8282edb3c2f6eb32d0256110256115956110156100156100156172d2a02c3b852aed44d0d200018e42fa40fa40fa00d33fd401d001d401d0d401d001d31fd4d31f301049104810471046104509d15507706d6d6df8237020106e6d0e107d0c107b0a107910681057105659e30d1110111111100f11100f550edb3c57105f0f318100e0164f82801db3c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d06702f83001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200018e42fa40fa40fa00d33fd401d001d401d0d401d001d31fd4d31f301049104810471046104509d15507706d6d6df8237020106e6d0e107d0c107b0a107910681057105659e30d1112945f0f5f03e0705611d749c21f96305610d70b1fde20101100aafa40d200d72c01916d93fa4001e201fa40fa00d33fd401d001d401d0d401d001f404f404d4d31fd72c01916d93fa4001e201d33fd31fd31ffa00300a11110a0a11100a10af10ae10ad10ac10ab57110f11100f550e044a82107362d09cbae30220821005138d91bae3022082107b7b7b7bbae3022082108d4b6e9fba1224263d03fe3011108020d721d33ffa00fa4030f8282fdb3cf84201c705f2e191531dbef2e192f8416f24135f0382100bebc200bef2e1932f6eb3f2e19a111321a001111301546bb052e01116db3c820afaf0802c02c87101cb1f14cb3f12cb3f01fa02ccc92d206ef2d080820b938700587050237fc8cf8580ca00cf8440ce01fa02806a2a13220482c86f00016f8c6d6f8c5004db3c8b220238db3c018e22c821c10098802d01cb0701a301de019a7aa90ca630541220c000e63068a592cb07e4da11c9d0db3c8b12087777771404c0db3cf823f828c86f00016f8c6d6f8c8d04151bdb98d85cdd081cdd185ad9590e8820db3c258e22c821c10098802d01cb0701a301de019a7aa90ca630541220c000e63068a592cb07e4da11c9d0db3c8bf2061742074696d657374616d703a208777777150480db3c228e22c821c10098802d01cb0701a301de019a7aa90ca630541220c000e63068a592cb07e4da11c9d0db3c8be20696e20636f6e74726163743a208db3c2177777716048edb3cdb3cc826fa025230cb3f22cf16c9c86f00016f8c6d6f8c5006db3c068e22c821c10098802d01cb0701a301de019a7aa90ca630541220c000e63068a592cb07e4da11c9d01619777717046cdb3c8b12d8db3c028e22c821c10098802d01cb0701a301de019a7aa90ca630541220c000e63068a592cb07e4da11c9d012db3c8b12d877777718041adb3c01db3cdb3c8b42e706e6787719771d0242fa44c88b111801ce028307a0a9380758cb07cbffc9d020db3c01c8cecec9d0db3c1a1b0094c8ce8b20000801cec9d0709421c701b38e2a01d30783069320c2008e1b03aa005323b091a4de03ab0023840fbc9903840fb0811021b203dee8303101e8318307a90c01c8cb07cb07c9d001a08d10105090d1115191d2125292d3135393d4145494d5155595d61656985898d9195999da1a5a9adb1b5b9bdc1c5c9cdd1d5d9dde1e5e8c0c4c8ccd0d4d8dce0e4b57e0c89522d749c2178ae86c21c9d01c009a02d307d307d30703aa0f02aa0712b101b120ab11803fb0aa02523078d7245004ce23ab0b803fb0aa02523078d72401ce23ab05803fb0aa02523078d72401ce03803fb0aa02522078d7245003ce0290db3c016f2201c993216eb396016f2259ccc9e831d0036f2201c993216eb396016f2259ccc9e831d0016f2201c993216eb396016f2259ccc9e831d01023db3cc85003cf1612ccccc9771e02b46d830782f082a3537ff0dbce7eec35d69edc3a189ee6f17d82f353a553f9aa96cb0be3ce8905c87001cb076f00016f8c6d6f8c01db3c6f2201c993216eb396016f2259ccc9e831413015206e953059f45b30944133f417e28307211f02f282f0c9046f7a37ad0ea7cee73355984fa5428982f8b37c8f7bcec91f7ac71a7cd10403c87001cb076f00016f8c6d6f8c01db3c6f2201c993216eb396016f2259ccc9e8314130206e953059f45b30944133f417e2830782f06105d6cc76af400325e94d588ce511be5bfdbb73b437dc51eca43917d7a43e3d0321200172c87001cb076f00016f8c6d6f8c01db3c6f2201c993216eb396016f2259ccc9e8314130206e953059f45b30944133f417e2c87001cb07f400c9210104db3c77014ccf40f400c901fb0009a40e11100e10df10ce10bd10ac0b108a107910681057104610354403022302b62f8e3f246eb38e39f8276f1020820afaf080bc8e2925206ef2d08001820afaf080a1726d40037fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb009130e2de8e96f82324b9917097f82324a123a904e25302bc9130e30de2667901fc3011108020d721d33ffa40302e6eb3f2e19af8420981010b53a3810101216e955b59f4593098c801cf004133f441e21881010b5420aa206e953059f4593096c8ce4133f441e2f8416f24135f03207aa904a17103c80182103a3a3a3a58cb1fcb3fc9103a41a040037fc8cf8580ca00cf8440ce01fa02806acf40f400c9012500e8fb000e11100e10df10ce10bd10ac109b108a10795e255514c87f01ca001111111055e0011110011111ce1eca00500c206e9430cf84809201cee21ace5008fa0216cb3f04c8ce14cdc803c8ce13cdf40012f40012cc12cb1f58206e9430cf84809201cee212cb3f12cb1f12cb1f58fa02cdc9ed5401ec3011108020d721d33fd33fd430f8422a81010b228101014133f40a6fa19401d70030925b6de2206eb3f2e19b2a81010b2359f40a6fa192306ddf206eb3f2e19b01206ef2d08025baf2e19c02d020d74ac201f2e1a3d401d0fa40fa403002d4305613206ef2d08012c705f2e19d5612206ef2d08050052702fcc8cb3f01cf16c98801705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d05220c705f2e1a2f828c705f2e19e02d0fa00d33ffa4030f828c705f2e1a1523c81010bf45930503a81010bf45930111422a1f8416f24135f038208989680a151b6a125a90420c000412801fe92307091a4e21110111311100f11120f0e11110e0d11130d0c11120c0b11110b0a11130a0911120908111308071115070611120605111305041115040311120302111302111401f82324b9917097f82324a123a904e2a570215617be8e1c30205616a1a420a6638064a904820898968058a8820898968058a8a0de111356132903fea1f8285610db3c6d6dc882100f8a7ea501cb1f01111b01cb3f5617fa025618206ef2d080cf165618206ef2d080cf1601111a01f40022a7558064a904fa0201111901f400c902111802720140037fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb005611c2008e12041115040311140302111302571157115f03e30d2a3b3c027a88c870fa025003cf1601cf16ccc98801705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d02b2b0114ff00f4a413f4bcf2c80b2c0201622d3a0202cc2e300201d42f4b00c30831c02497c138007434c0c05c6c2544d7c0fc03383e903e900c7e800c5c75c87e800c7e800c1cea6d0000b4c7e08403e29fa954882ea54c4d167c0278208405e3514654882ea58c511100fc02b80d60841657c1ef2ea4d67c02f817c12103fcbc200201203139020120323401f1503d33ffa00fa4021f001ed44d0fa00fa40fa40d4305136a1522ac705f2e2c128c2fff2e2c254344270542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c920f9007074c8cb02ca07cbffc9d004fa40f40431fa0020d749c200f2e2c4778018c8cb055008cf1670fa0217cb6b13cc833009e8210178d4519c8cb1f19cb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25008a813a08209c9c380a014bcf2e2c504c98040fb001023c85004fa0258cf1601cf16ccc9ed54020120353802f73b51343e803e903e90350c0234cffe80145468017e903e9014d6f1c1551cdb5c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0327e401c1d3232c0b281f2fff274140371c1472c7cb8b0c2be80146a2860822625a019ad822860822625a028062849e5c412440e0dd7c138c34975c2c060363700705279a018a182107362d09cc8cb1f5230cb3f58fa025007cf165007cf16c9718010c8cb0524cf165006fa0215cb6a14ccc971fb0010241023007cc30023c200b08e218210d53276db708010c8cb055008cf165004fa0216cb6a12cb1f12cb3fc972fb0093356c21e203c85004fa0258cf1601cf16ccc9ed5400d73b51343e803e903e90350c01f4cffe803e900c145468549271c17cb8b049f0bffcb8b08160824c4b402805af3cb8b0e0841ef765f7b232c7c572cfd400fe8088b3c58073c5b25c60063232c14933c59c3e80b2dab33260103ec01004f214013e809633c58073c5b3327b55200083d40106b90f6a2687d007d207d206a1802698fc1080bc6a28ca9105d41083deecbef09dd0958f97162e99f98fd001809d02811e428027d012c678b00e78b6664f6aa4001ba0f605da89a1f401f481f481a86100b4f828711115206ef2d0800302111402011116011117c8553082108d4b6e9f5005cb1f13ce01fa02cb1fcb1fc903111303021110020111120140037fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb000f11100f10cf10cd00d40b11100b10af109e108d107c5546c87f01ca001111111055e0011110011111ce1eca00500c206e9430cf84809201cee21ace5008fa0216cb3f04c8ce14cdc803c8ce13cdf40012f40012cc12cb1f58206e9430cf84809201cee212cb3f12cb1f12cb1f58fa02cdc9ed5403fc8f733011108020d721fa40fa00d31fd31f30f842f828c705f2e1ae21a664a521b608935320bb8ae8325cb98e3ef82870804204a410364506c8553082108d4b6e9f5005cb1f13ce01fa02cb1fcb1fc9102340037fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb00925f04e20e11100e551de0208210946a98b6ba3e793f01def828523001db3c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d0820898968072705387c8552082103a9b4f225004cb1f12cb3fce01fa02c940037fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb0002a4026704dce302821053544f50bae30257100e11100e551d2f8e3f246eb38e39f8276f1020820afaf080bc8e2925206ef2d08001820afaf080a1726d40037fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb009130e2de8e96f82324b9917097f82324a123a904e25302bc9130e30de24063667903fe3057100c6ef2e199f8416f24135f03207aa904c8c9c85270ccccc9f8288858c85003cf167001cb3f12ccccc988015c705920f90022f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f90400c87401cb0212ca07cbffc9d05043a14130716d50437f595f41f90001f9005ad76501d76582020134c8cb17cb0fcb0f4152620114ff00f4a413f4bcf2c80b42020162434f0202ce444c020120454b03e50c8871c02497c0f83434c0c05c6c2497c0f83e903e900c7e800c5c75c87e800c7e800c1cea6d003c00816ce38556db088d148cb1c17cb865407e9035350c040d3c00f801f4c7f4cfe08417f30f45148c2eb8c08c0d8dcde0840bf2c9a894982eb8c0a0840e8e8e8e85aeb8c097c1a103fcbc2046494a02b2321048103710261045025136c705f2e191fa4021f001fa40d20031fa0020d749c200f2e2c4820afaf0801ca121945315a0a1de22d70b01c300209206a19136e220c2fff2e1922194102b385be30d0293303335e30d5503f0034748007c821005138d91c8500acf16500ccf1671244a145446b0708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb001058006a27f0018210d53276db103845006d71708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb00007c3234347082108b77173504c8cb3f5005cf16102410238040708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb00008ec85005cf165005cf16c9c8cc14ccc97082107b7b7b7b04c8cb3f12cc4430128040708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb0000113e910c1c2ebcb853600201204d4e00393b513434cffe900835d27080263e9035350c1fd550380c1c165b5b5b600021013232cfd400f3c58073c5b333327b552002016a5051000bb5f9fe004610000bb4c03e0046300114ff00f4a413f4bcf2c80b53020162545d0202cd555802e1d10638048adf000e8698180b8d848adf07d201800e98fe99f98f6a2687d20699fea6a1828b1e382f970c8926000c7179a01699fa989ddf970c92989dd00fd006a1813881a2cf803470880d22001e42802678b09659fe66664f6aa492f82717012600171811901e001f1812f824207f9784565700a0347003d4308e378040f4966fa5208e2906a4208100fabe93f2c18fde81019321a05325bbf2f402fa00d43022544a30f00623ba9302a402de04926c21e2b3e630325023c85004cf1612cb3fccccc9ed54002401fa403003c85004cf1612cb3fccccc9ed54020120595c0201205a5b002d007232cffe0a33c5b25c083232c044fd003d0032c03260001b3e401d3232c084b281f2fff27420003d45af0047021f005778018c8cb0558cf165004fa0213cb6b12ccccc971fb0080201205e610201205f600007b8b5d3180029ba7a3ed44d0fa40d33fd4d4306c31f0047001f00580023bc82df6a2687d20699fea6a1818686a182c40186cbffcbff71f9040003c8cf8580ca0012cccccf884008cbff01fa028069cf40cf8634f400c901fb000e11100e10df0e10bd10ac109b108a1079106810571046103544307902fc11108020d721fa40300f11100f10ef10de10cd10bc10ab109a10891078106710561045103411114130db3c343e7f5610f8276f1020820afaf080bc8e26820afaf080a101111201726d40037fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb0093305711e20f111010de10cd10bc10ab109a10891078106710560464650012f8425611c705f2e08400be415503c87f01ca001111111055e0011110011111ce1eca00500c206e9430cf84809201cee21ace5008fa0216cb3f04c8ce14cdc803c8ce13cdf40012f40012cc12cb1f58206e9430cf84809201cee212cb3f12cb1f12cb1f58fa02cdc9ed5401f2f8276f10820afaf080a120821005f5e100bc8ee1f8285004db3c7224c80182105a75ae3e58cb1f01fa02c910341023102650437f595f41f90001f9005ad76501d76582020134c8cb17cb0fcb0fcbffcbff71f9040003c8cf8580ca0012cccccf884008cbff01fa028069cf40cf8634f400c901fb00923032e267011e88c87001ca005a02ce810101cf00c9680228ff008e88f4a413f4bcf2c80bed5320e303ed43d96971020378a06a6c0157bb571ed44d0d200019efa40d31ffa00fa00d20055406c159efa40810101d7005902d101702070e2db3c6c5586b000a54732153370201206d6f0157b4a3bda89a1a400033df481a63ff401f401a400aa80d82b3df481020203ae00b205a202e040e1c5b678d8a306e000224015bb416fda89a1a400033df481a63ff401f401a400aa80d82b3df481020203ae00b205a202e040e1c4aa09b678d8a3070004821b3917f9322c000e2917f9320c101e2923070e023a822a9042082084c4b40b9923070e002ec3001d072d721d200d200fa4021103450666f04f86102f862ed44d0d200019efa40d31ffa00fa00d20055406c159efa40810101d7005902d101702070e206925f06e004d70d1fdd2182105a75ae3ebae3020182103a9b4f22bae302304034c87f01ca0055405045ce12cb1f01fa0201fa02ca00c9ed547273019c31fa003010344135db3c6c21b3f2e1fc22c200f2e1f5f8416f24135f03820afaf080bef2e1faf8416f24135f03820afaf080a155027fc87f01ca0055405045ce12cb1f01fa0201fa02ca00c9ed547404f4d33f31fa40fa00305056db3c20f2e1f426c200f2e1f65361bbf2e1f721c200f2e1f95162a821a9042082084c4b40bef2e1f8c86f00016f8c6d6f8c8b745706f636820238db3c248e22c821c10098802d01cb0701a301de019a7aa90ca630541220c000e63068a592cb07e4da11c9d0db3c8b7207265776172648747777750010f84225c705f2e08404fedb3cf8276f102282084c4b40a0bc8eb38042016f2201c993216eb396016f2259ccc9e831d0db3c103740037fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb008eb731708100a0026f2201c993216eb396016f2259ccc9e831d0db3c10371240037fc8cf8580ca00cf8440ce01fa02806acf40f400c901fb00e24034777676780142c87001cb1f6f00016f8c6d6f8c01db3c6f2201c993216eb396016f2259ccc9e8317700b620d74a21d7499720c20022c200b18e48036f22807f22cf31ab02a105ab025155b60820c2009a20aa0215d71803ce4014de596f025341a1c20099c8016f025044a1aa028e123133c20099d430d020d74a21d749927020e2e2e85f030030c87f01ca0055405045ce12cb1f01fa0201fa02ca00c9ed5400b8c87f01ca001111111055e0011110011111ce1eca00500c206e9430cf84809201cee21ace5008fa0216cb3f04c8ce14cdc803c8ce13cdf40012f40012cc12cb1f58206e9430cf84809201cee212cb3f12cb1f12cb1f58fa02cdc9ed541f5d64fa');
    const builder = beginCell();
    builder.storeUint(0, 1);
    initToncastDAO_init_args({ $$type: 'ToncastDAO_init_args', owner, jettonMasterAddress, minDepositAmount, nextItemIndex, nftNamePrefix, nftImageUrl, epochDuration, collectionMetadata, seq })(builder);
    const __data = builder.endCell();
    return { code: __code, data: __data };
}

export const ToncastDAO_errors = {
    2: { message: "Stack underflow" },
    3: { message: "Stack overflow" },
    4: { message: "Integer overflow" },
    5: { message: "Integer out of expected range" },
    6: { message: "Invalid opcode" },
    7: { message: "Type check error" },
    8: { message: "Cell overflow" },
    9: { message: "Cell underflow" },
    10: { message: "Dictionary error" },
    11: { message: "'Unknown' error" },
    12: { message: "Fatal error" },
    13: { message: "Out of gas error" },
    14: { message: "Virtualization error" },
    32: { message: "Action list is invalid" },
    33: { message: "Action list is too long" },
    34: { message: "Action is invalid or not supported" },
    35: { message: "Invalid source address in outbound message" },
    36: { message: "Invalid destination address in outbound message" },
    37: { message: "Not enough Toncoin" },
    38: { message: "Not enough extra currencies" },
    39: { message: "Outbound message does not fit into a cell after rewriting" },
    40: { message: "Cannot process a message" },
    41: { message: "Library reference is null" },
    42: { message: "Library change action error" },
    43: { message: "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree" },
    50: { message: "Account state size exceeded limits" },
    128: { message: "Null reference exception" },
    129: { message: "Invalid serialization prefix" },
    130: { message: "Invalid incoming message" },
    131: { message: "Constraints error" },
    132: { message: "Access denied" },
    133: { message: "Contract stopped" },
    134: { message: "Invalid argument" },
    135: { message: "Code of a contract was not found" },
    136: { message: "Invalid standard address" },
    138: { message: "Not a basechain address" },
} as const

export const ToncastDAO_errors_backward = {
    "Stack underflow": 2,
    "Stack overflow": 3,
    "Integer overflow": 4,
    "Integer out of expected range": 5,
    "Invalid opcode": 6,
    "Type check error": 7,
    "Cell overflow": 8,
    "Cell underflow": 9,
    "Dictionary error": 10,
    "'Unknown' error": 11,
    "Fatal error": 12,
    "Out of gas error": 13,
    "Virtualization error": 14,
    "Action list is invalid": 32,
    "Action list is too long": 33,
    "Action is invalid or not supported": 34,
    "Invalid source address in outbound message": 35,
    "Invalid destination address in outbound message": 36,
    "Not enough Toncoin": 37,
    "Not enough extra currencies": 38,
    "Outbound message does not fit into a cell after rewriting": 39,
    "Cannot process a message": 40,
    "Library reference is null": 41,
    "Library change action error": 42,
    "Exceeded maximum number of cells in the library or the maximum depth of the Merkle tree": 43,
    "Account state size exceeded limits": 50,
    "Null reference exception": 128,
    "Invalid serialization prefix": 129,
    "Invalid incoming message": 130,
    "Constraints error": 131,
    "Access denied": 132,
    "Contract stopped": 133,
    "Invalid argument": 134,
    "Code of a contract was not found": 135,
    "Invalid standard address": 136,
    "Not a basechain address": 138,
} as const

const ToncastDAO_types: ABIType[] = [
    {"name":"DataSize","header":null,"fields":[{"name":"cells","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bits","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"refs","type":{"kind":"simple","type":"int","optional":false,"format":257}}]},
    {"name":"SignedBundle","header":null,"fields":[{"name":"signature","type":{"kind":"simple","type":"fixed-bytes","optional":false,"format":64}},{"name":"signedData","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"StateInit","header":null,"fields":[{"name":"code","type":{"kind":"simple","type":"cell","optional":false}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"Context","header":null,"fields":[{"name":"bounceable","type":{"kind":"simple","type":"bool","optional":false}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"raw","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"SendParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"code","type":{"kind":"simple","type":"cell","optional":true}},{"name":"data","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"MessageParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"to","type":{"kind":"simple","type":"address","optional":false}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"DeployParameters","header":null,"fields":[{"name":"mode","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"body","type":{"kind":"simple","type":"cell","optional":true}},{"name":"value","type":{"kind":"simple","type":"int","optional":false,"format":257}},{"name":"bounce","type":{"kind":"simple","type":"bool","optional":false}},{"name":"init","type":{"kind":"simple","type":"StateInit","optional":false}}]},
    {"name":"StdAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":8}},{"name":"address","type":{"kind":"simple","type":"uint","optional":false,"format":256}}]},
    {"name":"VarAddress","header":null,"fields":[{"name":"workchain","type":{"kind":"simple","type":"int","optional":false,"format":32}},{"name":"address","type":{"kind":"simple","type":"slice","optional":false}}]},
    {"name":"BasechainAddress","header":null,"fields":[{"name":"hash","type":{"kind":"simple","type":"int","optional":true,"format":257}}]},
    {"name":"ChangeOwner","header":2174598809,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"ChangeOwnerOk","header":846932810,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"newOwner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"Deploy","header":2490013878,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"DeployOk","header":2952335191,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"FactoryDeploy","header":1829761339,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"cashback","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"DeployEpoch","header":1517661758,"fields":[{"name":"totalToncastStaked","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"PayoutStaker","header":983256866,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"stakerAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"stakerToncastAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"ProcessEpochPayouts","header":2370530975,"fields":[{"name":"userAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"withdrawnAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"startEpoch","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"endEpoch","type":{"kind":"simple","type":"uint","optional":false,"format":32}}]},
    {"name":"EpochData","header":null,"fields":[{"name":"epochNumber","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"totalTonReceived","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalToncastStaked","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"isInitialized","type":{"kind":"simple","type":"bool","optional":false}},{"name":"owner","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"JettonTransferNotification","header":1935855772,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"sender","type":{"kind":"simple","type":"address","optional":false}},{"name":"forwardPayload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"NftTransferNotification","header":85167505,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"prevOwner","type":{"kind":"simple","type":"address","optional":false}},{"name":"forwardPayload","type":{"kind":"simple","type":"slice","optional":false,"format":"remainder"}}]},
    {"name":"NftGetAllData","header":976894522,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}}]},
    {"name":"NftReportAllData","header":2071690107,"fields":[{"name":"queryId","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"index","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"data","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"StopAndRedirect","header":1398034256,"fields":[{"name":"newDaoAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"JettonWalletData","header":null,"fields":[{"name":"balance","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"ownerAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"jettonMasterAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"jettonWalletCode","type":{"kind":"simple","type":"cell","optional":false}}]},
    {"name":"StakingData","header":null,"fields":[{"name":"amount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"timestamp","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"daoAddress","type":{"kind":"simple","type":"address","optional":false}}]},
    {"name":"DAOEpochData","header":null,"fields":[{"name":"deployTime","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"currentRealTimeEpoch","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"epochDuration","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"currentStoredEpochNumber","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"totalCurrentlyStaked","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
    {"name":"DAOConfigData","header":null,"fields":[{"name":"nextItemIndex","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"nftCollectionAddress","type":{"kind":"simple","type":"address","optional":true}},{"name":"jettonMasterAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"jettonWalletAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"minDepositAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"nftNamePrefix","type":{"kind":"simple","type":"string","optional":false}},{"name":"nftImageUrl","type":{"kind":"simple","type":"string","optional":false}},{"name":"isReadyToAcceptDeposits","type":{"kind":"simple","type":"bool","optional":false}},{"name":"stopped","type":{"kind":"simple","type":"bool","optional":false}},{"name":"newDaoAddress","type":{"kind":"simple","type":"address","optional":true}}]},
    {"name":"ToncastDAOepoch$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"epochNumber","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"totalTonReceived","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"totalToncastStaked","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"isInitialized","type":{"kind":"simple","type":"bool","optional":false}}]},
    {"name":"ToncastDAO$Data","header":null,"fields":[{"name":"owner","type":{"kind":"simple","type":"address","optional":false}},{"name":"stopped","type":{"kind":"simple","type":"bool","optional":false}},{"name":"nftCollectionAddress","type":{"kind":"simple","type":"address","optional":true}},{"name":"jettonMasterAddress","type":{"kind":"simple","type":"address","optional":false}},{"name":"minDepositAmount","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}},{"name":"nextItemIndex","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"nftNamePrefix","type":{"kind":"simple","type":"string","optional":false}},{"name":"nftImageUrl","type":{"kind":"simple","type":"string","optional":false}},{"name":"pendingWithdrawals","type":{"kind":"dict","key":"address","value":"int"}},{"name":"pendingWithdrawalOwners","type":{"kind":"dict","key":"address","value":"address"}},{"name":"collectionMetadata","type":{"kind":"simple","type":"cell","optional":false}},{"name":"seq","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"newDaoAddress","type":{"kind":"simple","type":"address","optional":true}},{"name":"deployTime","type":{"kind":"simple","type":"uint","optional":false,"format":64}},{"name":"epochDuration","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"lastProcessedEpoch","type":{"kind":"simple","type":"uint","optional":false,"format":32}},{"name":"totalCurrentlyStaked","type":{"kind":"simple","type":"uint","optional":false,"format":"coins"}}]},
]

const ToncastDAO_opcodes = {
    "ChangeOwner": 2174598809,
    "ChangeOwnerOk": 846932810,
    "Deploy": 2490013878,
    "DeployOk": 2952335191,
    "FactoryDeploy": 1829761339,
    "DeployEpoch": 1517661758,
    "PayoutStaker": 983256866,
    "ProcessEpochPayouts": 2370530975,
    "JettonTransferNotification": 1935855772,
    "NftTransferNotification": 85167505,
    "NftGetAllData": 976894522,
    "NftReportAllData": 2071690107,
    "StopAndRedirect": 1398034256,
}

const ToncastDAO_getters: ABIGetter[] = [
    {"name":"getDAOConfigData","methodId":104592,"arguments":[],"returnType":{"kind":"simple","type":"DAOConfigData","optional":false}},
    {"name":"getDAOEpochData","methodId":92403,"arguments":[],"returnType":{"kind":"simple","type":"DAOEpochData","optional":false}},
    {"name":"getEpochContractAddress","methodId":116010,"arguments":[{"name":"epochNumber","type":{"kind":"simple","type":"int","optional":false,"format":257}}],"returnType":{"kind":"simple","type":"address","optional":false}},
    {"name":"getCollectionMetadata","methodId":84523,"arguments":[],"returnType":{"kind":"simple","type":"cell","optional":false}},
    {"name":"owner","methodId":83229,"arguments":[],"returnType":{"kind":"simple","type":"address","optional":false}},
]

export const ToncastDAO_getterMapping: { [key: string]: string } = {
    'getDAOConfigData': 'getGetDaoConfigData',
    'getDAOEpochData': 'getGetDaoEpochData',
    'getEpochContractAddress': 'getGetEpochContractAddress',
    'getCollectionMetadata': 'getGetCollectionMetadata',
    'owner': 'getOwner',
}

const ToncastDAO_receivers: ABIReceiver[] = [
    {"receiver":"internal","message":{"kind":"typed","type":"JettonTransferNotification"}},
    {"receiver":"internal","message":{"kind":"typed","type":"NftTransferNotification"}},
    {"receiver":"internal","message":{"kind":"typed","type":"NftReportAllData"}},
    {"receiver":"internal","message":{"kind":"typed","type":"ProcessEpochPayouts"}},
    {"receiver":"internal","message":{"kind":"typed","type":"Deploy"}},
    {"receiver":"internal","message":{"kind":"typed","type":"StopAndRedirect"}},
    {"receiver":"internal","message":{"kind":"any"}},
]

export const TONCAST_JETTON_WALLET_CODE = Cell.fromHex("b5ee9c7241021101000323000114ff00f4a413f4bcf2c80b0102016202100202cc03060201d4040500c30831c02497c138007434c0c05c6c2544d7c0fc03383e903e900c7e800c5c75c87e800c7e800c1cea6d0000b4c7e08403e29fa954882ea54c4d167c0278208405e3514654882ea58c511100fc02b80d60841657c1ef2ea4d67c02f817c12103fcbc2000113e910c1c2ebcb85360020120070f020120080a01f1503d33ffa00fa4021f001ed44d0fa00fa40fa40d4305136a1522ac705f2e2c128c2fff2e2c254344270542013541403c85004fa0258cf1601cf16ccc922c8cb0112f400f400cb00c920f9007074c8cb02ca07cbffc9d004fa40f40431fa0020d749c200f2e2c4778018c8cb055008cf1670fa0217cb6b13cc809009e8210178d4519c8cb1f19cb3f5007fa0222cf165006cf1625fa025003cf16c95005cc2391729171e25008a813a08209c9c380a014bcf2e2c504c98040fb001023c85004fa0258cf1601cf16ccc9ed540201200b0e02f73b51343e803e903e90350c0234cffe80145468017e903e9014d6f1c1551cdb5c150804d50500f214013e809633c58073c5b33248b232c044bd003d0032c0327e401c1d3232c0b281f2fff274140371c1472c7cb8b0c2be80146a2860822625a019ad822860822625a028062849e5c412440e0dd7c138c34975c2c0600c0d00705279a018a182107362d09cc8cb1f5230cb3f58fa025007cf165007cf16c9718010c8cb0524cf165006fa0215cb6a14ccc971fb0010241023007cc30023c200b08e218210d53276db708010c8cb055008cf165004fa0216cb6a12cb1f12cb3fc972fb0093356c21e203c85004fa0258cf1601cf16ccc9ed5400d73b51343e803e903e90350c01f4cffe803e900c145468549271c17cb8b049f0bffcb8b08160824c4b402805af3cb8b0e0841ef765f7b232c7c572cfd400fe8088b3c58073c5b25c60063232c14933c59c3e80b2dab33260103ec01004f214013e809633c58073c5b3327b55200083d40106b90f6a2687d007d207d206a1802698fc1080bc6a28ca9105d41083deecbef09dd0958f97162e99f98fd001809d02811e428027d012c678b00e78b6664f6aa4001ba0f605da89a1f401f481f481a861bb5c4775");
export const OP_NFT_DEPLOY = 1n;
export const OP_NFT_TRANSFER_NOTIFICATION = 85167505n;
export const OP_NFT_GET_ALL_DATA = 976894522n;
export const OP_NFT_REPORT_ALL_DATA = 2071690107n;
export const TONCAST_NFT_COLLECTION_CODE = Cell.fromHex("b5ee9c7241021001000181000114ff00f4a413f4bcf2c80b01020162020b0202cd030602e1d10638048adf000e8698180b8d848adf07d201800e98fe99f98f6a2687d20699fea6a1828b1e382f970c8926000c7179a01699fa989ddf970c92989dd00fd006a1813881a2cf803470880d22001e42802678b09659fe66664f6aa492f82717012600171811901e001f1812f824207f9784040500a0347003d4308e378040f4966fa5208e2906a4208100fabe93f2c18fde81019321a05325bbf2f402fa00d43022544a30f00623ba9302a402de04926c21e2b3e630325023c85004cf1612cb3fccccc9ed54002401fa403003c85004cf1612cb3fccccc9ed54020120070a0201200809002d007232cffe0a33c5b25c083232c044fd003d0032c03260001b3e401d3232c084b281f2fff27420003d45af0047021f005778018c8cb0558cf165004fa0213cb6b12ccccc971fb0080201200c0f0201200d0e0007b8b5d3180029ba7a3ed44d0fa40d33fd4d4306c31f0047001f00580023bc82df6a2687d20699fea6a1818686a182c4e328de4a");
export const TONCAST_NFT_ITEM_CODE = Cell.fromHex("b5ee9c7241021101000248000114ff00f4a413f4bcf2c80b01020162020e0202ce030b020120040a03e50c8871c02497c0f83434c0c05c6c2497c0f83e903e900c7e800c5c75c87e800c7e800c1cea6d003c00816ce38556db088d148cb1c17cb865407e9035350c040d3c00f801f4c7f4cfe08417f30f45148c2eb8c08c0d8dcde0840bf2c9a894982eb8c0a0840e8e8e8e85aeb8c097c1a103fcbc2005080902b2321048103710261045025136c705f2e191fa4021f001fa40d20031fa0020d749c200f2e2c4820afaf0801ca121945315a0a1de22d70b01c300209206a19136e220c2fff2e1922194102b385be30d0293303335e30d5503f0030607007c821005138d91c8500acf16500ccf1671244a145446b0708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb001058006a27f0018210d53276db103845006d71708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb00007c3234347082108b77173504c8cb3f5005cf16102410238040708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb00008ec85005cf165005cf16c9c8cc14ccc97082107b7b7b7b04c8cb3f12cc4430128040708010c8cb055007cf165005fa0215cb6a12cb1fcb3f226eb39458cf17019132e201c901fb0000113e910c1c2ebcb853600201200c0d00393b513434cffe900835d27080263e9035350c1fd550380c1c165b5b5b600021013232cfd400f3c58073c5b333327b552002016a0f10000bb5f9fe004610000bb4c03e00463044d67833");

export class ToncastDAO implements Contract {
    
    public static readonly storageReserve = 0n;
    public static readonly errors = ToncastDAO_errors_backward;
    public static readonly opcodes = ToncastDAO_opcodes;
    
    static async init(owner: Address, jettonMasterAddress: Address, minDepositAmount: bigint, nextItemIndex: bigint, nftNamePrefix: string, nftImageUrl: string, epochDuration: bigint, collectionMetadata: Cell, seq: bigint) {
        return await ToncastDAO_init(owner, jettonMasterAddress, minDepositAmount, nextItemIndex, nftNamePrefix, nftImageUrl, epochDuration, collectionMetadata, seq);
    }
    
    static async fromInit(owner: Address, jettonMasterAddress: Address, minDepositAmount: bigint, nextItemIndex: bigint, nftNamePrefix: string, nftImageUrl: string, epochDuration: bigint, collectionMetadata: Cell, seq: bigint) {
        const __gen_init = await ToncastDAO_init(owner, jettonMasterAddress, minDepositAmount, nextItemIndex, nftNamePrefix, nftImageUrl, epochDuration, collectionMetadata, seq);
        const address = contractAddress(0, __gen_init);
        return new ToncastDAO(address, __gen_init);
    }
    
    static fromAddress(address: Address) {
        return new ToncastDAO(address);
    }
    
    readonly address: Address; 
    readonly init?: { code: Cell, data: Cell };
    readonly abi: ContractABI = {
        types:  ToncastDAO_types,
        getters: ToncastDAO_getters,
        receivers: ToncastDAO_receivers,
        errors: ToncastDAO_errors,
    };
    
    constructor(address: Address, init?: { code: Cell, data: Cell }) {
        this.address = address;
        this.init = init;
    }
    
    async send(provider: ContractProvider, via: Sender, args: { value: bigint, bounce?: boolean| null | undefined }, message: JettonTransferNotification | NftTransferNotification | NftReportAllData | ProcessEpochPayouts | Deploy | StopAndRedirect | Slice) {
        
        let body: Cell | null = null;
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'JettonTransferNotification') {
            body = beginCell().store(storeJettonTransferNotification(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'NftTransferNotification') {
            body = beginCell().store(storeNftTransferNotification(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'NftReportAllData') {
            body = beginCell().store(storeNftReportAllData(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'ProcessEpochPayouts') {
            body = beginCell().store(storeProcessEpochPayouts(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'Deploy') {
            body = beginCell().store(storeDeploy(message)).endCell();
        }
        if (message && typeof message === 'object' && !(message instanceof Slice) && message.$$type === 'StopAndRedirect') {
            body = beginCell().store(storeStopAndRedirect(message)).endCell();
        }
        if (message && typeof message === 'object' && message instanceof Slice) {
            body = message.asCell();
        }
        if (body === null) { throw new Error('Invalid message type'); }
        
        await provider.internal(via, { ...args, body: body });
        
    }
    
    async getGetDaoConfigData(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getDAOConfigData', builder.build())).stack;
        const result = loadGetterTupleDAOConfigData(source);
        return result;
    }
    
    async getGetDaoEpochData(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getDAOEpochData', builder.build())).stack;
        const result = loadGetterTupleDAOEpochData(source);
        return result;
    }
    
    async getGetEpochContractAddress(provider: ContractProvider, epochNumber: bigint) {
        const builder = new TupleBuilder();
        builder.writeNumber(epochNumber);
        const source = (await provider.get('getEpochContractAddress', builder.build())).stack;
        const result = source.readAddress();
        return result;
    }
    
    async getGetCollectionMetadata(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('getCollectionMetadata', builder.build())).stack;
        const result = source.readCell();
        return result;
    }
    
    async getOwner(provider: ContractProvider) {
        const builder = new TupleBuilder();
        const source = (await provider.get('owner', builder.build())).stack;
        const result = source.readAddress();
        return result;
    }
    
}