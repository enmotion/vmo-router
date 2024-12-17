declare namespace transtion{
    export type name='zoomin'|'fade'|'zoombounce'|'scalex'|'scaley'|'pushx'|'pushy'|'growy'|'growx'|'flipx'|'flipy'|'scrollUp'|'scrollDown'|'scrollLeft'|'scrollRight'|'falling'|'blur';
    export type mode='out-in'|'in-out'|'default';
    export type align='col'|'row';
    export type timing='ease'|'ease-in'|'ease-out'|'ease-in-out'|number[]
    export type tag = 'ul'|'div'|'section'|'span'
}
export default transtion;