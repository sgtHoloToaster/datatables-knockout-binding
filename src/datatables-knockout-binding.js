ko.bindingHandlers.datatable = {
    init: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        const data = valueAccessor();
        data.subscribe(function () {
            $(element).closest('table').DataTable().destroy();
            ko.bindingHandlers.foreach.update(element, valueAccessor, allBindings, viewModel, bindingContext);
            var tableOptions = allBindings.get("tableOptions") || {};
            $(element).closest('table').DataTable(tableOptions);
        }, null, 'arrayChange');

        const nodes = Array.prototype.slice.call(element.childNodes, 0);
        ko.utils.arrayForEach(nodes, function (node) {
            if (node && node.nodeType !== 1) {
                node.parentNode.removeChild(node);
            }
        });

        return ko.bindingHandlers.foreach.init(element, valueAccessor, allBindings, viewModel, bindingContext);
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {
        const updateSyncKey = 'dt-update-sync';
        const updateTimeout = 500;
        var updateSync = parseInt(ko.utils.domData.get(element, updateSyncKey) || '');
        if (updateSync)
            clearTimeout(updateSync);

        updateSync = setTimeout(() => {
            var table = $(element).closest('table').DataTable();
            table.destroy();

            var data = ko.utils.unwrapObservable(valueAccessor());
            ko.bindingHandlers.foreach.update(element, valueAccessor, allBindings, viewModel, bindingContext);
            var tableOptions = allBindings.get("tableOptions") || {};
            table = $(element).closest('table').DataTable(tableOptions);

            const key = 'dt-initialized';
            if (!ko.utils.domData.get(element, key) && data)
                ko.utils.domData.set(element, key, true);

            return {
                controlsDescendantBindings: true
            };
        }, updateTimeout);
        ko.utils.domData.set(element, updateSyncKey, updateSync.toString());
    }
};